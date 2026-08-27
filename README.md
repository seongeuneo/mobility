# 모빌리티 프론트엔드

정적 웹사이트 + PWA (manifest.json, service worker 포함)

## 로컬에서 열어보기
차량/인사이트 등 데이터를 `data.json`에서 `fetch`로 불러오기 때문에, `index.html`을 더블클릭해서(`file://`) 여는 방식은 브라우저 보안 정책(CORS)에 막혀 데이터가 비어 보일 수 있습니다. 반드시 로컬 서버로 실행하세요:
```
npx serve .
```

## GitHub Pages로 배포
1. 이 저장소를 GitHub에 push
2. Settings → Pages → Branch: `main` / `/(root)` 선택
3. 몇 분 후 `https://<username>.github.io/<repo>/` 에서 확인
