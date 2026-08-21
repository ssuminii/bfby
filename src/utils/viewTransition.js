import { flushSync } from 'react-dom'

/**
 * 화면 전환을 View Transition으로 감싼다.
 *
 * react-router의 viewTransition 옵션은 RouterProvider(데이터 라우터)에서만 동작한다.
 * 이 앱은 BrowserRouter를 쓰므로 직접 호출한다.
 *
 * flushSync가 필요한 이유: startViewTransition은 콜백이 끝난 시점의 DOM으로
 * 전환 후 스냅샷을 찍는다. React 업데이트는 기본적으로 배치되어 콜백이 끝난 뒤에
 * 반영되므로, 강제로 동기 처리하지 않으면 전환 전후가 같은 화면이 된다.
 *
 * ★ App.jsx의 <BrowserRouter useTransitions={false}>와 짝이다.
 *   그 프롭이 없으면 라우터가 위치 변경을 React.startTransition으로 감싸는데,
 *   transition 업데이트는 flushSync로도 동기화되지 않아 아래 flushSync가 헛돈다.
 *   애니메이션이 조용히 사라지므로 프롭을 지우지 마라.
 *
 * 지원하지 않는 브라우저에서는 애니메이션 없이 그대로 이동한다.
 */
export function withViewTransition(run) {
  if (!document.startViewTransition) {
    run()
    return
  }
  document.startViewTransition(() => flushSync(run))
}
