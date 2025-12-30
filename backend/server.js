const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3001;

const DASHSCOPE_API_KEY = process.env.DASHSCOPE_API_KEY;
const FRONTEND_API_KEY = process.env.FRONTEND_API_KEY;

const ALLOWED_ORIGINS = [
  'http://creatorlens.top',
  'https://creatorlens.top',
  'http://www.creatorlens.top',
  'https://www.creatorlens.top',
  'http://localhost:5173',
  'http://localhost:5180',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5180',
  // 沙箱域名
  'https://5173-ii45ssaaaqz82u4fr6ulh-c74f0814.us2.manus.computer',
  'https://5174-ii45ssaaaqz82u4fr6ulh-c74f0814.us2.manus.computer',
  'https://5180-ii45ssaaaqz82u4fr6ulh-c74f0814.us2.manus.computer',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      console.warn('[Security] Blocked request from unauthorized origin: ' + origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
  credentials: true,
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: 'Too many requests',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    const apiKey = req.headers['x-api-key'];
    return apiKey === FRONTEND_API_KEY;
  },
});

app.use(limiter);

console.log('[API] Creator Lens API server running on port ' + PORT);
console.log('[Security] CORS whitelist: ' + ALLOWED_ORIGINS.join(', '));
console.log('[Security] Rate limit: 30 requests per minute per IP');

const validateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== FRONTEND_API_KEY) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Invalid API key' });
  }
  next();
};

async function fetchWithRetry(url, options, maxRetries) {
  if (!maxRetries) maxRetries = 3;
  let lastError;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      console.log('[API] Fetch attempt ' + (attempt + 1) + '/' + maxRetries + ': ' + url.substring(0, 80) + '...');
      const response = await fetch(url, Object.assign({}, options, { timeout: options.timeout || 60000 }));
      return response;
    } catch (error) {
      lastError = error;
      console.error('[API] Fetch error (attempt ' + (attempt + 1) + '/' + maxRetries + '): ' + error.message);
      
      if (attempt < maxRetries - 1) {
        const delay = Math.pow(2, attempt) * 1000;
        console.log('[API] Retrying after ' + delay + 'ms...');
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
}

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/api/generate-image', validateApiKey, async (req, res) => {
  const startTime = Date.now();
  const prompt = req.body.prompt;
  const useImageReference = req.body.useImageReference;
  const imageBase64 = req.body.imageBase64;

  console.log('[' + new Date().toISOString() + '] POST /api/generate-image from ' + req.ip);
  console.log('[API] Image generation request received');

  if (!prompt) {
    return res.status(400).json({ success: false, error: 'Missing prompt' });
  }

  try {
    let imageUrl;

    if (useImageReference && imageBase64) {
      console.log('[API] Using image-to-image mode (qwen-image-edit-plus)');
      
      const submitResponse = await fetchWithRetry(
        'https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation',
        {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + DASHSCOPE_API_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'qwen-image-edit-plus',
            input: {
              messages: [
                {
                  role: 'user',
                  content: [
                    { image: imageBase64 },
                    { text: prompt },
                  ],
                },
              ],
            },
            parameters: { n: 1 },
          }),
          timeout: 90000,
        },
        3
      );

      if (!submitResponse.ok) {
        const errorText = await submitResponse.text();
        console.error('[API] Image-to-image submit failed: ' + errorText);
        throw new Error('Image-to-image failed: ' + submitResponse.status);
      }

      const submitResult = await submitResponse.json();
      console.log('[API] Image-to-image response:', JSON.stringify(submitResult).substring(0, 500));
      
      // qwen-image-edit-plus 返回格式: output.choices[0].message.content[0].image
      if (submitResult.output && submitResult.output.choices && submitResult.output.choices[0]) {
        const choice = submitResult.output.choices[0];
        if (choice.message && choice.message.content && choice.message.content[0]) {
          imageUrl = choice.message.content[0].image || '';
        }
      }
      // 兼容旧格式: output.image_url
      if (!imageUrl && submitResult.output && submitResult.output.image_url) {
        imageUrl = submitResult.output.image_url;
      }

      if (!imageUrl) {
        console.error('[API] No image URL returned from image-to-image, response:', JSON.stringify(submitResult));
        throw new Error('No image URL returned');
      }

      const elapsed = Date.now() - startTime;
      console.log('[API] Image generated in ' + elapsed + 'ms (image-to-image mode)');
    } else {
      console.log('[API] Using text-to-image mode (qwen-image-plus)');

      const submitResponse = await fetchWithRetry(
        'https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis',
        {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + DASHSCOPE_API_KEY,
            'Content-Type': 'application/json',
            'X-DashScope-Async': 'enable',
          },
          body: JSON.stringify({
            model: 'qwen-image-plus',
            input: { prompt: prompt },
            parameters: {
              size: '1328*1328',
              n: 1,
              prompt_extend: true,
              watermark: false,
            },
          }),
          timeout: 60000,
        },
        3
      );

      if (!submitResponse.ok) {
        const errorText = await submitResponse.text();
        console.error('[API] Task submit failed: ' + errorText);
        throw new Error('Task submit failed: ' + submitResponse.status);
      }

      const submitResult = await submitResponse.json();
      const taskId = submitResult.output && submitResult.output.task_id ? submitResult.output.task_id : '';

      if (!taskId) {
        console.error('[API] No task_id returned');
        throw new Error('No task_id returned');
      }

      console.log('[API] Task submitted: ' + taskId);

      const maxAttempts = 60;
      for (let i = 0; i < maxAttempts; i++) {
        await new Promise(resolve => setTimeout(resolve, 2000));

        const statusResponse = await fetchWithRetry(
          'https://dashscope.aliyuncs.com/api/v1/tasks/' + taskId,
          {
            method: 'GET',
            headers: {
              'Authorization': 'Bearer ' + DASHSCOPE_API_KEY,
            },
            timeout: 30000,
          },
          2
        );

        if (!statusResponse.ok) {
          console.error('[API] Status check failed');
          continue;
        }

        const statusResult = await statusResponse.json();
        const taskStatus = statusResult.output && statusResult.output.task_status ? statusResult.output.task_status : '';

        console.log('[API] Task status (attempt ' + (i + 1) + '): ' + taskStatus);

        if (taskStatus === 'SUCCEEDED') {
          imageUrl = statusResult.output && statusResult.output.results && statusResult.output.results[0] && statusResult.output.results[0].url ? statusResult.output.results[0].url : '';
          break;
        } else if (taskStatus === 'FAILED') {
          const errorMsg = statusResult.output && statusResult.output.message ? statusResult.output.message : 'Task failed';
          console.error('[API] Task failed: ' + errorMsg);
          throw new Error(errorMsg);
        }
      }

      if (!imageUrl) {
        console.error('[API] No image URL generated');
        throw new Error('Image generation failed or timed out');
      }

      const elapsed = Date.now() - startTime;
      console.log('[API] Image generated in ' + elapsed + 'ms (text-to-image mode)');
    }

    let base64 = '';
    const maxDownloadRetries = 3;
    
    for (let retry = 0; retry < maxDownloadRetries; retry++) {
      try {
        console.log('[API] Downloading image (attempt ' + (retry + 1) + '/' + maxDownloadRetries + ')...');
        const imageResponse = await fetchWithRetry(imageUrl, { timeout: 60000 }, 2);
        
        if (!imageResponse.ok) {
          throw new Error('HTTP ' + imageResponse.status);
        }
        
        const imageBuffer = await imageResponse.buffer();
        base64 = imageBuffer.toString('base64');
        console.log('[API] Image downloaded successfully (' + imageBuffer.length + ' bytes)');
        break;
      } catch (downloadError) {
        console.error('[API] Download attempt ' + (retry + 1) + ' failed: ' + downloadError.message);
        if (retry < maxDownloadRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
    }
    
    if (!base64) {
      console.log('[API] Download failed, returning URL instead');
      return res.json({
        success: true,
        imageUrl: imageUrl,
        base64: null,
        elapsed: Date.now() - startTime,
        mode: useImageReference ? 'image-to-image' : 'text-to-image',
        note: 'Image URL returned instead of base64 due to download failure',
      });
    }

    res.json({
      success: true,
      imageUrl: imageUrl,
      base64: base64,
      elapsed: Date.now() - startTime,
      mode: useImageReference ? 'image-to-image' : 'text-to-image',
    });
  } catch (error) {
    console.error('[API] Error: ' + error.message);
    res.status(500).json({
      success: false,
      error: error.message || 'Image generation failed',
      elapsed: Date.now() - startTime,
    });
  }
});

app.listen(PORT, () => {
  console.log('[API] Server listening on port ' + PORT);
});
