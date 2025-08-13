# 🔑 환경변수 및 API 키 설정 가이드

## 📋 필수 설정 항목

### 1. Supabase (필수)
Supabase 프로젝트 생성 후 설정 필요

```bash
# .env.local 파일에 추가
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT_ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...당신의_anon_key
SUPABASE_SERVICE_ROLE_KEY=eyJ...당신의_service_role_key  # 서버 전용, 절대 노출 금지!
```

**획득 방법:**
1. [Supabase](https://supabase.com) 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. Project Settings → API
4. URL과 키 복사

---

### 2. Vercel (배포 시 필수)
Vercel 대시보드에서 설정

**환경변수 설정 위치:**
1. [Vercel Dashboard](https://vercel.com) → 프로젝트 선택
2. Settings → Environment Variables
3. 아래 변수들 추가:

```bash
# Production, Preview, Development 환경별 설정 가능
NEXT_PUBLIC_SUPABASE_URL=[your_supabase_url]
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your_anon_key]
SUPABASE_SERVICE_ROLE_KEY=[your_service_role_key]
```

---

## 🔐 선택적 설정 항목 (프로젝트 필요 시)

### 3. 인증 제공자 (OAuth)
소셜 로그인 사용 시 필요

```bash
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Kakao OAuth
KAKAO_CLIENT_ID=your_kakao_client_id
KAKAO_CLIENT_SECRET=your_kakao_client_secret

# Naver OAuth
NAVER_CLIENT_ID=your_naver_client_id
NAVER_CLIENT_SECRET=your_naver_client_secret
```

**설정 방법:**
1. Supabase Dashboard → Authentication → Providers
2. 각 제공자 활성화 및 키 입력
3. Redirect URL 설정: `https://[PROJECT_ID].supabase.co/auth/v1/callback`

---

### 4. 결제 시스템
전자상거래 기능 필요 시

```bash
# Stripe
STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Toss Payments
TOSS_CLIENT_KEY=your_client_key
TOSS_SECRET_KEY=your_secret_key

# PortOne (구 아임포트)
PORTONE_API_KEY=your_api_key
PORTONE_API_SECRET=your_api_secret
PORTONE_IMP_CODE=imp...
```

---

### 5. 이메일 서비스
트랜잭션 이메일 발송 시

```bash
# SendGrid
SENDGRID_API_KEY=SG...

# Resend
RESEND_API_KEY=re_...

# AWS SES
AWS_SES_REGION=ap-northeast-2
AWS_SES_ACCESS_KEY_ID=...
AWS_SES_SECRET_ACCESS_KEY=...
```

---

### 6. 파일 저장소
대용량 파일 처리 시

```bash
# AWS S3
AWS_S3_BUCKET=your-bucket-name
AWS_S3_REGION=ap-northeast-2
AWS_S3_ACCESS_KEY_ID=...
AWS_S3_SECRET_ACCESS_KEY=...

# Cloudflare R2
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=...
```

---

### 7. 모니터링 & 분석
프로덕션 모니터링 시

```bash
# Vercel Analytics (자동 설정됨)
NEXT_PUBLIC_ANALYTICS_ID=...

# Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-...

# Sentry (에러 트래킹)
SENTRY_DSN=https://...@sentry.io/...
SENTRY_AUTH_TOKEN=...
SENTRY_ORG=your-org
SENTRY_PROJECT=your-project

# LogRocket
LOGROCKET_APP_ID=...
```

---

### 8. AI & API 서비스
AI 기능 사용 시

```bash
# OpenAI
OPENAI_API_KEY=sk-...

# Anthropic Claude
ANTHROPIC_API_KEY=sk-ant-...

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=...

# 카카오맵
NEXT_PUBLIC_KAKAO_MAP_API_KEY=...
```

---

### 9. 푸시 알림
모바일 푸시 알림 시

```bash
# Firebase Cloud Messaging
FIREBASE_PROJECT_ID=...
FIREBASE_PRIVATE_KEY=...
FIREBASE_CLIENT_EMAIL=...

# OneSignal
ONESIGNAL_APP_ID=...
ONESIGNAL_REST_API_KEY=...
```

---

## 📝 환경변수 관리 베스트 프랙티스

### 1. 파일 구조
```
web_project/
├── .env.local          # 로컬 개발용 (절대 커밋 X)
├── .env.example        # 템플릿 (키 이름만, 커밋 O)
├── .env.production     # 프로덕션 (절대 커밋 X)
└── .env.test          # 테스트용 (필요시)
```

### 2. 보안 규칙
- ❌ **절대 커밋 금지**: `.env.local`, `.env.production`
- ✅ **커밋 가능**: `.env.example` (값 없이 키 이름만)
- 🔒 **서버 전용 키**: `SUPABASE_SERVICE_ROLE_KEY` 등은 서버에서만 사용
- 🌐 **클라이언트 키**: `NEXT_PUBLIC_` 접두사가 있는 키만 브라우저 노출

### 3. 환경별 설정
```typescript
// 환경별 조건부 설정
const isDevelopment = process.env.NODE_ENV === 'development'
const isProduction = process.env.NODE_ENV === 'production'

// API 엔드포인트 예시
const API_URL = isProduction 
  ? 'https://api.production.com' 
  : 'http://localhost:3000'
```

### 4. 타입 안전성
```typescript
// types/env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_SUPABASE_URL: string
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string
    SUPABASE_SERVICE_ROLE_KEY?: string
    // 추가 환경변수 타입 정의
  }
}
```

---

## 🚀 빠른 시작 체크리스트

### 필수 설정 (최소 요구사항)
- [ ] Supabase 프로젝트 생성
- [ ] `.env.local` 파일 생성
- [ ] `NEXT_PUBLIC_SUPABASE_URL` 설정
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` 설정
- [ ] Vercel 프로젝트 연결 (배포 시)
- [ ] Vercel 환경변수 설정 (배포 시)

### 권장 설정
- [ ] `.env.example` 파일 업데이트
- [ ] 타입 정의 파일 작성 (`env.d.ts`)
- [ ] Git에 `.env.local` 제외 확인
- [ ] Sentry 에러 트래킹 설정
- [ ] Analytics 설정

---

## 📌 중요 참고사항

1. **Supabase 무료 티어 제한**
   - 500MB 데이터베이스
   - 1GB 파일 저장소
   - 50,000 MAU (월간 활성 사용자)
   - 2개 프로젝트

2. **Vercel 무료 티어 제한**
   - 100GB 대역폭
   - 100시간 빌드 시간
   - 12개 프로젝트
   - 커스텀 도메인 지원

3. **키 순환 주기**
   - 프로덕션 키: 3-6개월마다 순환 권장
   - 개발 키: 프로젝트 완료 후 재생성
   - 유출 시: 즉시 재생성 및 교체

4. **환경변수 검증**
   ```typescript
   // app/lib/env-check.ts
   export function checkEnvVariables() {
     const required = [
       'NEXT_PUBLIC_SUPABASE_URL',
       'NEXT_PUBLIC_SUPABASE_ANON_KEY'
     ]
     
     const missing = required.filter(key => !process.env[key])
     
     if (missing.length > 0) {
       throw new Error(`Missing environment variables: ${missing.join(', ')}`)
     }
   }
   ```

---

**마지막 업데이트**: 2024년 설정 기준
**문의사항**: 각 서비스 공식 문서 참조