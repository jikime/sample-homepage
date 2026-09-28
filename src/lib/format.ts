/** 정수 원 단위 금액 — "650,000원" */
export function formatWon(amount: number): string {
  return `${amount.toLocaleString("ko-KR")}원`
}
