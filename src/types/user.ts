export interface UserProfile {
  id: string
  username: string
  display_name: string | null
  description: string | null
  ml_kem_public_key: string
  ecdh_public_key: string
  ed_public_key: string
  date: string
}
