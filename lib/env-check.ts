/**
 * 환경변수 검증 유틸리티
 * 필수 환경변수가 설정되어 있는지 확인합니다.
 */

type EnvVarConfig = {
  required: string[]
  optional?: string[]
}

export class EnvError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'EnvironmentVariableError'
  }
}

/**
 * 필수 환경변수 검증
 */
export function checkEnvVariables(config?: Partial<EnvVarConfig>) {
  const defaultRequired = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  ]

  const required = config?.required || defaultRequired
  const missing: string[] = []
  const invalid: string[] = []

  // 필수 환경변수 체크
  required.forEach(key => {
    const value = process.env[key]
    
    if (!value) {
      missing.push(key)
    } else if (value.includes('your_') || value.includes('[PROJECT_ID]') || value === 'eyJ...') {
      invalid.push(key)
    }
  })

  // 에러 처리
  if (missing.length > 0) {
    throw new EnvError(
      `Missing required environment variables:\n${missing.map(k => `  - ${k}`).join('\n')}\n\n` +
      `Please check your .env.local file and ensure all required variables are set.`
    )
  }

  if (invalid.length > 0) {
    throw new EnvError(
      `Invalid environment variables (still using placeholder values):\n${invalid.map(k => `  - ${k}`).join('\n')}\n\n` +
      `Please update these variables with actual values in your .env.local file.`
    )
  }

  // 선택적 환경변수 경고
  if (config?.optional) {
    const missingOptional = config.optional.filter(key => !process.env[key])
    
    if (missingOptional.length > 0 && process.env.NODE_ENV === 'development') {
      console.warn(
        `⚠️  Optional environment variables not set:\n${missingOptional.map(k => `  - ${k}`).join('\n')}\n` +
        `These features may not work without these variables.`
      )
    }
  }

  return true
}

/**
 * 환경변수 타입 안전 접근
 */
export function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key]
  
  if (!value && !defaultValue) {
    throw new EnvError(`Environment variable ${key} is not defined`)
  }
  
  return value || defaultValue!
}

/**
 * 현재 환경 확인
 */
export const env = {
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
  isPreview: process.env.VERCEL_ENV === 'preview',
}

/**
 * Supabase 설정 헬퍼
 */
export const supabaseConfig = {
  url: () => getEnvVar('NEXT_PUBLIC_SUPABASE_URL'),
  anonKey: () => getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
  serviceRoleKey: () => {
    if (typeof window !== 'undefined') {
      throw new EnvError('Service role key should never be accessed on the client side!')
    }
    return getEnvVar('SUPABASE_SERVICE_ROLE_KEY')
  },
}

/**
 * 사이트 설정 헬퍼
 */
export const siteConfig = {
  url: () => getEnvVar('NEXT_PUBLIC_SITE_URL', 
    env.isProduction 
      ? 'https://your-domain.com' 
      : 'http://localhost:3000'
  ),
}