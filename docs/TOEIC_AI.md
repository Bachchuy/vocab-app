# TOEIC vocabulary fields and AI suggestions

Each saved word can include its Vietnamese meaning, part of speech, IPA, workplace example, TOEIC context, related word forms, synonyms, antonyms, collocations, source, and personal notes. Open a word and choose **Sửa** to change any field. The related forms field uses one form per line:

```text
noun | acquisition | sự mua lại
adjective | acquisitive | có tính thu nhận
```

The **Gợi ý bằng AI** button fills the editable form; it never saves automatically. Review the generated information before saving. Some words do not have a useful antonym, so that list can be empty.

## Enable AI suggestions

AI suggestions call the local NestJS backend, which then calls the OpenAI Responses API. The API key stays in the backend and is not included in the frontend or the desktop app.

1. Open `backend/.env` (create it by copying `backend/.env.example` if needed).
2. Set `OPENAI_API_KEY` to your API key. Optionally set `OPENAI_MODEL` to a model available to your account.
3. Start the backend with `npm run start:dev` from the `backend` directory.
4. Keep the backend running while requesting suggestions. The desktop app makes requests to `http://localhost:3000`.

AI suggestions need internet access and API usage enabled for the key. The dictionary itself continues to work without AI. Never commit `.env` or share its key.

## Update the database and desktop app

From `backend`, run `npm run db:generate` and `npx prisma migrate deploy`. Then from `frontend`, run `npm run tauri build` to create an updated Windows installer. The desktop database also adds any missing vocabulary fields when the app starts.
