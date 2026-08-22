import test from "node:test";
import assert from "node:assert/strict";
import { KINDS, normalizeKind } from "./productKind.js";

test("목록에 있는 이름은 그대로 돌려준다", () => {
  for (const [category, kinds] of Object.entries(KINDS)) {
    for (const kind of kinds) {
      assert.equal(normalizeKind(category, kind), kind);
    }
  }
});

test("모델이 흘려 쓴 이름을 목록에 있는 이름으로 되돌린다", () => {
  // 실제로 모델이 이렇게 내놓은 적이 있는 표기들
  assert.equal(normalizeKind("전자기기", "집에 두고 쓰는 가전"), "집에 두는 가전");
  assert.equal(normalizeKind("뷰티", "화장품, 미용기기"), "화장품");
  assert.equal(normalizeKind("생활용품", "청소 세탁"), "청소·세탁");
  assert.equal(normalizeKind("의류", "신발/가방"), "신발·가방");
});

test("붙일 데가 없으면 null이다. 억지로 갖다 붙이면 엉뚱한 기록과 견주게 된다", () => {
  assert.equal(normalizeKind("식품", "전동 킥보드"), null);
  assert.equal(normalizeKind("뷰티", ""), null);
  assert.equal(normalizeKind("뷰티", null), null);
  assert.equal(normalizeKind("없는카테고리", "화장품"), null);
});
