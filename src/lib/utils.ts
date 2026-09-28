import { createCn } from "cn/config"

/**
 * 디자인 시스템 타입 스케일(text-display-xl … text-mono)을 font-size 그룹으로 알려 준다.
 * 알려 주지 않으면 `text-overline text-muted-foreground`처럼 크기와 색이 같은 `text-*`로 보여
 * 앞의 크기 클래스가 지워진다.
 */
export const cn = createCn({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: ["display-xl", "display-lg", "h1", "h2", "h3", "body-lg", "body", "body-sm", "caption", "overline", "mono"],
        },
      ],
    },
  },
})
