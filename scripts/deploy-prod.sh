#!/usr/bin/env bash
# luckywin.kr 프로덕션 배포
#
# origin/main을 임시 디렉터리에 새로 받아 배포합니다.
# 로컬 워킹트리의 미커밋 변경이 실수로 배포되는 것을 막기 위한 것입니다.
#
# 사용법:  ./scripts/deploy-prod.sh
set -euo pipefail

# Vercel CLI가 팀·프로젝트를 다시 조회하지 않도록 고정합니다.
# 조회 단계에서 간헐적으로 "Not authorized"가 발생합니다.
export VERCEL_ORG_ID="team_TavN9JyJsczf7S0D3ik4RmxB"
export VERCEL_PROJECT_ID="prj_0ZuXYw6bPVJEYBkaUeH8gRxTQ0D3"

REPO="https://github.com/dongil-tak/luckywin.git"
WORKDIR="$(mktemp -d)"
trap 'rm -rf "$WORKDIR"' EXIT

echo "==> origin/main 내려받는 중"
git clone --depth 1 --branch main "$REPO" "$WORKDIR/src" --quiet
COMMIT="$(git -C "$WORKDIR/src" log --oneline -1)"
echo "    $COMMIT"

# .vercel 링크는 git에 없으므로(gitignore) 로컬에서 복사합니다.
SELF_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
if [ ! -d "$SELF_DIR/frontend/.vercel" ]; then
  echo "오류: $SELF_DIR/frontend/.vercel 이 없습니다. 'vercel link'로 프로젝트를 연결하십시오." >&2
  exit 1
fi
cp -R "$SELF_DIR/frontend/.vercel" "$WORKDIR/src/frontend/.vercel"

echo "==> 배포 중"
npx vercel --prod --yes --cwd="$WORKDIR/src/frontend"

echo
echo "==> 라이브 확인"
ASSET="$(curl -fsS https://luckywin.kr/ | grep -o '/assets/index-[A-Za-z0-9_-]*\.js' | head -1)"
LATEST="$(curl -fsS "https://luckywin.kr$ASSET" | grep -oE 'round:1[0-9]{3}' | head -1)"
echo "    번들: $ASSET"
echo "    최신 회차: ${LATEST:-확인 실패}"
