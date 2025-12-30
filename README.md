# Creator Lens

**图像创意工坊** - 如果邀请一位当代艺术家来为你创作...

Creator Lens 是一个基于 AI 的图像创意应用，它将用户上传的图片通过不同艺术家/创作者的方法论进行"转译"，生成独特的策展文本和艺术化图像。

## 项目结构

```
creator_lens/
├── frontend/          # 前端应用 (React + TypeScript + Vite)
│   ├── ability_cards/ # 能力卡数据（创作者方法论）
│   ├── components/    # UI 组件
│   ├── services/      # API 服务
│   └── ...
├── backend/           # 后端 API 代理 (Node.js + Express)
│   └── server.js
└── README.md
```

## 快速开始

### 前端

```bash
cd frontend
npm install
cp .env.example .env.local
# 编辑 .env.local 填入 API 密钥
npm run dev
```

### 后端

```bash
cd backend
npm install
cp .env.example .env
# 编辑 .env 填入 API 密钥
node server.js
```

## 环境变量

### 前端 (.env.local)
- `VITE_DASHSCOPE_API_KEY`: 阿里云 DashScope API 密钥
- `VITE_FRONTEND_API_KEY`: 前端 API 密钥

### 后端 (.env)
- `DASHSCOPE_API_KEY`: 阿里云 DashScope API 密钥
- `FRONTEND_API_KEY`: 前端 API 密钥
- `PORT`: 服务端口（默认 3001）

## 技术栈

- **前端**: React, TypeScript, Vite, TailwindCSS
- **后端**: Node.js, Express
- **AI**: 阿里云 DashScope (qwen-plus, qwen-image-edit-plus)

## License

MIT
