// HeyHo Account Linking Types

export interface HeyHoAccountStatus {
  linked: boolean
  heyho_user_id?: number
  linked_at?: string
}

export interface InitiateHeyHoLinkResponse {
  authorize_url: string
  client_id: string
  redirect_uri: string
}

export interface HeyHoCallbackParams {
  code: string
  redirect_uri?: string
}

export interface HeyHoLinkResult {
  success: boolean
  message?: string
  heyho_user_id?: number
  linked_at?: string
  error?: string
}
