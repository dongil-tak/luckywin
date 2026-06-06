# 윈웨이(Win-Way) 로또 분석 서비스 개발 및 배포 가이드

본 문서는 **윈웨이(Win-Way) 로또 분석/예측 서비스**의 주요 개발 이력 및 배포 방식에 대해 정리한 요약 파일입니다.

---

## 1. 프로젝트 개요
* **서비스명**: 윈웨이(Win-Way)
* **주요 기능**: AI 통계 기반 로또 번호 최적 조합 분석, 번호 자동/수동 선택 및 저장, 당첨 판매점 정보 제공 등
* **주요 기술 스택**: 
  * Frontend: Vite + React + TypeScript + TailwindCSS
  * Backend API: Vercel Serverless Functions

---

## 2. 주요 개발 이력

### 📌 구글 애드센스 광고 연동
* **적용 위치**: 대시보드의 번호선택패드 바로 위
* **내용**: 
  * 구글 애드센스 광고 스크립트 및 디스플레이 인피드 광고(Fluid) 유닛 적용.
  * 레이아웃이 자연스럽게 유지되도록 스타일 구성.

### 📌 UI/UX 및 레이아웃 개선
* **선택 번호 영역 상단 고정 (Sticky Header)**:
  * 대시보드에서 선택 중인 번호 영역을 스크롤 시 화면 최상단에 고정하여 스크롤 시에도 사용자가 선택한 번호를 쉽게 확인 가능하도록 개선.
  * 고정 시 좌우 및 상단 여백을 없애 화면에 완전히 밀착되도록 스타일링 조정.
* **버튼 레이아웃 최적화**:
  * 기존 세로 배열 등 비효율적이었던 '번호복사'와 '번호저장' 버튼을 동일한 행에 2열(가로로 나란히)로 재배치하여 공간 활용도 극대화.

### 📌 기능성 및 문구 개선
* **번호 저장 후 초기화**:
  * 분석 결과 페이지에서 생성된 조합을 저장한 뒤에는 화면의 입력값 및 결과 상태가 초기화되도록 비즈니스 로직 수정.
* **직관적인 문구 변경**:
  * 기존 리프레시 버튼 명칭을 사용자가 이해하기 쉬운 **"번호 다시 받기"**로 변경.

### 📌 브랜드 BI 리뉴얼 및 파비콘 캐시 해결
* **BI 로고 및 에셋 교체**:
  * 윈웨이 브랜딩에 맞춘 로고 이미지(`og_image.png`)와 신규 앱 아이콘/파비콘 이미지 적용.
* **파비콘 브라우저 캐싱 문제 우회**:
  * 브라우저가 기존 파비콘을 지나치게 강하게 캐싱하는 문제를 방지하기 위해 파일 경로를 표준화하고 캐시 무효화 쿼리 스트링을 적용 (`/favicon.png?v=3`).

### 📌 클로드 작업 이력 반영 및 최적화
* **하드코딩된 가짜 당첨 데이터 제거 (`LuckyHistory.tsx`)**:
  * `prizes` 인터페이스에서 가짜 금액 정보였던 `rank2`, `rank3` 제거 및 상세 팝업에서도 1등 당첨 정보만 노출되도록 정리.
* **불필요한 안내 및 도넛 차트 제거 (`Management.tsx`, `LottoStore.tsx`)**:
  * 적중률 관련 변수(`hitRate`) 및 "우리 서비스의 적중률" 도넛 차트 전면 삭제.
  * 복권 판매소 페이지 하단의 "연동 데이터 소스 / 지도 연동 예정" 카드 삭제.
* **선택 세트 유지 기능 (Draft 동기화, `Dashboard.tsx`)**:
  * `localStorage` (`dashboard_draft_sets`)를 활용하여 번호 선택 중 뒤로 가기 등으로 페이지를 이탈하더라도 다시 복구하여 이어할 수 있는 기능 추가.
  * 최종 저장(`handleSaveConfirm`) 시에는 해당 드래프트 캐시가 즉시 삭제되도록 초기화 로직 구현.
* **린트 오류 14건 해결**:
  * 에센스 배너 및 지도 컴포넌트의 타입 린트 오류를 해결하여 빌드 신뢰도 강화.

---

## 3. 빌드 및 배포 방식

서비스는 **Vercel** 플랫폼을 통해 호스팅 및 배포되고 있습니다.

### 로컬 빌드 검증
배포 전에 로컬에서 TypeScript 타입 체크 및 Vite 빌드 안정성을 검증합니다.
```bash
cd frontend
npm run build
```

### Vercel 프로덕션 배포
Vercel CLI를 사용하여 지정된 Scope 하에 무중단 배포를 직접 실행합니다.
```bash
npx vercel --prod --yes --scope eduvationplan-9198s-projects
```

* **실 배포 및 도메인 주소**: [https://frontend-one-coral-12.vercel.app](https://frontend-one-coral-12.vercel.app)

---

## 4. 다음 단계 작업 준비 (하이브리드 앱 빌드)

구글 플레이 스토어 및 애플 앱스토어 출시를 위한 모바일 하이브리드 앱 환경 설정 계획입니다.

### Capacitor 연동 계획
Vite의 빌드 산출물(`dist` 디렉토리)을 모바일 네이티브 웹뷰로 매핑하기 위해 **Capacitor**를 설정합니다.

1. **Capacitor 패키지 설치**:
   ```bash
   npm install @capacitor/core @capacitor/cli
   ```
2. **Capacitor 초기화**:
   ```bash
   npx cap init WinWay com.winway.app --web-dir=dist
   ```
3. **플랫폼(Android, iOS) 추가**:
   ```bash
   npm install @capacitor/android @capacitor/ios
   npx cap add android
   npx cap add ios
   ```
4. **네이티브 빌드 동기화**:
   ```bash
   npm run build
   npx cap sync
   ```

---

## 5. 최근 작업 내역 및 환경 설정 디버깅 (2026-06-06)

최근 발생한 연동 및 외부 API 로드 관련 문제를 진단하고 해결한 세부 내역입니다. 다른 AI 협업 도구 및 개발자가 참고할 수 있도록 현황을 공유합니다.

### 1) 카카오 맵 API 403 Forbidden 에러 해결
* **문제 상황**: 지도 페이지([LottoStore.tsx](file:///Users/takdi/Desktop/lucky/frontend/src/pages/more/LottoStore.tsx)) 진입 시 카카오 맵 SDK 스크립트 로드 과정에서 `403 Forbidden` 발생 및 지도 미출력.
* **원인**: 
  * 로컬 환경변수([.env.local](file:///Users/takdi/Desktop/lucky/frontend/.env.local))에 `VITE_KAKAO_JAVASCRIPT_KEY`가 존재했으나, 배포 환경(Vercel)에는 해당 환경변수가 등록되지 않아 `undefined`로 호출됨.
* **조치 사항**:
  * Vercel 프로덕션 빌드 스코프(`eduvationplan-9198s-projects`)의 프로젝트 `frontend`에 `VITE_KAKAO_JAVASCRIPT_KEY` 및 `VITE_DATA_GO_KR_API_KEY` 환경변수를 Vercel CLI 명령어로 재생성하여 성공적으로 주입 완료.
  * 환경 변수가 반영된 신규 프로덕션 배포 완료 (배포 사이트: `https://frontend-one-coral-12.vercel.app`).

### 2) 구글 애드센스 노출 여부 분석 및 테스트 가이드
* **현황**: 광고 단위 코드([AdSenseBanner.tsx](file:///Users/takdi/Desktop/lucky/frontend/src/components/AdSenseBanner.tsx))가 대시보드에 배치되어 있으나 로컬 및 Vercel 임시 주소에서 광고 미출력.
* **원인**: 구글 애드센스의 '도메인 승인제' 정책으로 인해, 등록 및 승인을 받지 않은 도메인(`localhost`, `*.vercel.app`)에서의 광고 요청은 구글 서버 측에서 송출을 거부함.
* **해결 및 테스트 가이드**:
  * 코드 검증이 필요할 경우, [AdSenseBanner.tsx](file:///Users/takdi/Desktop/lucky/frontend/src/components/AdSenseBanner.tsx)의 `<ins>` 태그 내에 `data-ad-test="on"` 속성을 일시적으로 부여하여 '테스트 광고 박스'가 정상 출력되는지 검증 가능.

### 3) 신규 도메인 (`luckywin.kr`) 확보에 따른 후속 작업
사용자가 개인 독립 도메인인 `luckywin.kr`을 구매함에 따라 연동 설정을 진행 중입니다.

* **완료된 작업**:
  * 도메인 네임서버 및 DNS 설정 완료 (A 레코드를 `76.76.21.21`로, CNAME `www`를 `cname.vercel-dns.com`으로 매핑 완료).
  * Vercel 프로젝트 설정 내에 `luckywin.kr` 도메인 추가 완료.
* **향후 진행할 후속 작업 (다른 AI 툴을 위한 가이드)**:
  1. **Vercel 도메인 Active 대기**: DNS 전파 및 Vercel 내 SSL 인증서 발급이 완료되어 도메인 연결이 Active 상태가 되는지 확인.
  2. **카카오 개발자 콘솔 업데이트**: 
     * [카카오 개발자 센터](https://developers.kakao.com/) ➡️ 내 애플리케이션 ➡️ 플랫폼 ➡️ Web 설정의 사이트 도메인 목록에 `https://luckywin.kr` 및 `https://www.luckywin.kr` 추가 등록.
  3. **구글 애드센스 사이트 검토 신청**: 
     * 애드센스 대시보드 ➡️ [사이트] 메뉴에 `luckywin.kr` 추가하고 사이트 소유권 확인 및 검토 요청 제출.
