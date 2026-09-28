-- 자동 생성 파일 — 직접 고치지 마세요.
-- 원본: src/lib/landing/mock-data.ts · 생성: pnpm db:seed:generate (scripts/generate-seed.ts)
-- 다시 실행해도 결과가 같다: 작품은 upsert, 랜딩 페이지(home)는 지우고 새로 넣는다.

insert into public.artworks (id, title, creator, storage_path, width, height, size_label, category, tone, placement, placement_short) values
  ('summer-terrace', '여름빛 테라스', '소연', 'samples/summer-terrace.webp', 1024, 1280, '1080×1350', '라이프스타일', '자연광', '인스타그램 피드', '피드'),
  ('morning-skincare', '모닝 루틴 스킨케어', '하린', 'samples/morning-skincare.webp', 1024, 1024, '1080×1080', '뷰티', '파스텔', '인스타그램 피드', '피드'),
  ('home-cafe', '홈카페 신메뉴', '도윤', 'samples/home-cafe.webp', 1536, 804, '1200×628', 'F&B', '따뜻한 톤', '디스플레이 배너', '배너'),
  ('city-running', '도심 러닝 슈즈', '지후', 'samples/city-running.webp', 864, 1536, '1080×1920', '스포츠', '다이내믹', '인스타그램 스토리', '스토리'),
  ('autumn-outer', '가을 아우터 룩북', '서진', 'samples/autumn-outer.webp', 1024, 1280, '1080×1350', '패션', '무드', '페이스북', '페이스북'),
  ('pet-treats', '반려동물 간식 출시', '민재', 'samples/pet-treats.webp', 1024, 1024, '1080×1080', '펫', '선명한 컬러', '카카오', '카카오'),
  ('camping-lantern', '캠핑 랜턴 기획전', '태오', 'samples/camping-lantern.webp', 1024, 1280, '1080×1350', '아웃도어', '저녁 무드', '인스타그램 피드', '피드'),
  ('wireless-earbuds', '무선 이어폰 론칭', '유나', 'samples/wireless-earbuds.webp', 1536, 804, '1200×628', '테크', '미니멀', '디스플레이 배너', '배너'),
  ('fresh-juice', '제철 과일 주스', '예린', 'samples/fresh-juice.webp', 864, 1536, '1080×1920', 'F&B', '선명한 컬러', '인스타그램 스토리', '스토리')
on conflict (id) do update set
  title = excluded.title, creator = excluded.creator, storage_path = excluded.storage_path,
  width = excluded.width, height = excluded.height, size_label = excluded.size_label,
  category = excluded.category, tone = excluded.tone, placement = excluded.placement,
  placement_short = excluded.placement_short;

delete from public.landing_pages where slug = 'home';

insert into public.landing_pages (slug, login_href) values
  ('home', '/login');

insert into public.landing_nav_items (page_slug, label, href, sort_order) values
  ('home', '진행 방식', '#how', 0),
  ('home', '샘플', '#samples', 1),
  ('home', '이용 안내', '#terms', 2);

insert into public.landing_heroes (page_slug, overline, overline_mobile, headline_lines, headline_accent, description, description_mobile, note, note_mobile, primary_cta, secondary_cta_label, secondary_cta_href) values
  ('home', '광고대행사를 위한 AI 이미지 광고 소재 · 관리형 제작', 'AI 이미지 광고 소재 · 관리형 제작', array['브리프 하나로,', '{accent} 안에', '검토된 후보를.']::text[], '48시간', '캠페인 조건을 보내면 운영팀이 검토한 AI 이미지 소재 후보를 같은 기준으로 비교해 드려요. 변형·검수·라이선스까지 포함된 파일로 받아보세요.', '운영팀이 검토한 AI 이미지 소재 후보를 같은 기준으로 비교하고, 라이선스까지 포함된 파일로 받아보세요.', '승인된 에이전시만 이용할 수 있어요 · 가입 신청은 영업일 1일 안에 검토해요', '승인된 에이전시만 이용할 수 있어요', '브리프 보내기', '진행 방식 보기', '#how');

insert into public.landing_hero_showcase_items (page_slug, layout, position, artwork_id, variant_storage_path, variant_width, variant_height, variant_size_label) values
  ('home', 'desktop', 0, 'city-running', null, null, null, null),
  ('home', 'desktop', 1, 'summer-terrace', 'samples/summer-terrace-square.webp', 1024, 1024, '1080×1080'),
  ('home', 'desktop', 2, 'home-cafe', null, null, null, null),
  ('home', 'mobile', 0, 'city-running', null, null, null, null),
  ('home', 'mobile', 1, 'summer-terrace', null, null, null, null);

insert into public.landing_section_headings (page_slug, section, overline, title_lines, title_lines_mobile, description, description_mobile) values
  ('home', 'problem', 'WHY', array['소재를 찾는 시간보다', '고르는 시간에 집중하세요']::text[], null, null, null),
  ('home', 'process', 'HOW IT WORKS', array['브리프부터 인수까지 6단계']::text[], null, '모든 단계는 프로젝트 화면 한 곳에서 진행 상황과 다음 할 일로 보여요.', ''),
  ('home', 'compare', 'COMPARE', array['모든 후보를 같은 7가지 기준으로']::text[], array['모든 후보를 같은', '7가지 기준으로']::text[], '항목이 하나라도 빠진 작품은 후보로 보내지 않아요. 순서도 늘 같아요.', '항목이 하나라도 빠진 작품은 후보로 보내지 않아요.'),
  ('home', 'samples', 'SAMPLES', array['심사를 통과한 샘플 작품']::text[], null, null, null),
  ('home', 'rules', 'OPERATING RULES', array['약속은 숫자로 정해 두었어요']::text[], array['약속은 숫자로', '정해 두었어요']::text[], null, null),
  ('home', 'terms', 'TERMS', array['이용 조건 요약']::text[], null, null, null);

insert into public.landing_problem_items (page_slug, code, label, title, problem, solution, sort_order) values
  ('home', '01', '탐색', '캠페인마다 제작자를 다시 찾아요', '매체·규격·납기·예산에 맞는 사람을 찾고 연락하고 조율하는 일을 매번 반복하게 돼요.', '정해진 양식의 브리프 한 번이면 운영팀이 후보를 골라 보내드려요.', 0),
  ('home', '02', '조율', '수정 범위가 모호하면 일정이 밀려요', '메신저로 오가는 수정 요청은 기록이 남지 않고, 재제작과의 경계가 흐려 비용과 납기가 늘어나요.', '표준 변형 5종과 수정 2회를 작업 전에 견적으로 확정해요.', 1),
  ('home', '03', '권리', 'AI 이미지의 이용 조건을 설명하기 어려워요', '생성 도구·후처리·이용 범위가 제각각이라 광고주가 물어볼 때 답하기가 곤란해요.', '생성·후처리 정보와 라이선스 증서를 납품 파일과 함께 드려요.', 2);

insert into public.landing_process_steps (page_slug, code, title, description, description_mobile, sort_order) values
  ('home', '01', '브리프', '캠페인·스타일·규격·납기·예산·이용 조건을 4단계 양식으로 보내요.', null, 0),
  ('home', '02', '후보', '검토된 후보 2~5개가 적합 이유와 함께 48시간 안에 도착해요.', null, 1),
  ('home', '03', '견적·결제', '가격·납기·수정 횟수·라이선스를 작업 전에 확인하고 승인해요.', null, 2),
  ('home', '04', '제작', '결제가 확인되면 크리에이터가 제작하고 운영팀이 체크리스트로 검수해요.', '결제가 확인되면 제작을 시작하고 운영팀이 체크리스트로 검수해요.', 3),
  ('home', '05', '납품', '합의한 규격의 파일, 라이선스 증서, 생성·후처리 정보를 함께 받아요.', '파일, 라이선스 증서, 생성·후처리 정보를 함께 받아요.', 4),
  ('home', '06', '완료', '확인 후 인수하거나 수정을 요청해요. 7일이 지나면 자동으로 인수돼요.', '인수하거나 수정을 요청해요. 7일이 지나면 자동으로 인수돼요.', 5);

insert into public.landing_candidates (id, page_slug, display_order, artwork_id, quality_note, quality_note_mobile, generation, generation_mobile, variations, variations_mobile, base_price, lead_days, license) values
  ('cand-1', 'home', 1, 'summer-terrace', '자연광 톤, 제품 합성 영역이 넓고 손·글자 왜곡 없음', null, '이미지 생성 도구 1종 · 색 보정·배경 정리 후처리', null, '리사이즈·리크롭 · 카피 영역 · 색감·톤', null, 650000, 4, '온라인 광고·SNS · 1년 · 대한민국 · 비독점'),
  ('cand-2', 'home', 2, 'morning-skincare', '밝은 파스텔 톤, 제품 질감이 선명하고 여백이 균형 잡힘', '밝은 파스텔 톤, 제품 질감이 선명함', '이미지 생성 도구 2종 · 제품 합성·리터치 후처리', '생성 도구 2종 · 제품 합성·리터치', '리사이즈·리크롭 · 배경색 교체 · 소품 1개 교체', '리사이즈·리크롭 · 배경색 · 소품 1개', 900000, 5, '온라인 광고·SNS · 1년 · 대한민국 · 비독점'),
  ('cand-3', 'home', 3, 'city-running', '역동적인 구도, 세로형 매체에 맞춘 여백과 대비', null, '이미지 생성 도구 1종 · 모션 블러·색 보정 후처리', null, '리사이즈·리크롭 · 카피 영역', null, 550000, 3, '온라인 광고·SNS · 1년 · 대한민국 · 비독점');

insert into public.landing_compare_examples (page_slug, caption, caption_mobile, default_candidate_id) values
  ('home', '예시 화면 · 후보 비교 (DP-2026-0014 여름 시즌 SNS 캠페인)', '예시 화면 · 후보 비교 (DP-2026-0014)', 'cand-2');

insert into public.landing_compare_row_labels (page_slug, position, label, label_mobile) values
  ('home', 0, '① 대표 이미지', null),
  ('home', 1, '② 품질 메모', null),
  ('home', 2, '③ 생성·후처리 정보', '③ 생성·후처리'),
  ('home', 3, '④ 변형 범위', null),
  ('home', 4, '⑤ 기준 가격', null),
  ('home', 5, '⑥ 기준 납기', null),
  ('home', 6, '⑦ 라이선스', null);

insert into public.landing_sample_sections (page_slug, more_label, initial_count_mobile, initial_count_desktop) values
  ('home', '샘플 더 보기', 4, 6);

insert into public.landing_sample_items (page_slug, artwork_id, sort_order) values
  ('home', 'summer-terrace', 0),
  ('home', 'morning-skincare', 1),
  ('home', 'home-cafe', 2),
  ('home', 'city-running', 3),
  ('home', 'autumn-outer', 4),
  ('home', 'pet-treats', 5),
  ('home', 'camping-lantern', 6),
  ('home', 'wireless-earbuds', 7),
  ('home', 'fresh-juice', 8);

insert into public.landing_operating_rules (page_slug, value, unit, title, description, description_mobile, emphasis, sort_order) values
  ('home', '48', '시간', '후보 제안', '브리프 완결 판정 후 48시간 안에 후보를 보내드려요.', '완결 판정 후 48시간 안에 보내드려요.', true, 0),
  ('home', '2~5', '개', '후보 수', '후보마다 적합 이유를 적고, 같은 7항목으로 정리해요.', '적합 이유와 7항목을 함께 정리해요.', false, 1),
  ('home', '2', '회', '수정 요청 포함', '합의 범위 안의 수정은 견적에 포함돼요.', null, false, 2),
  ('home', '1', '부', '라이선스 증서', '납품마다 이용 조건과 생성 정보를 담은 PDF를 드려요.', '납품마다 PDF로 드려요.', false, 3);

insert into public.landing_terms_sections (page_slug, detail_link_label, detail_link_href, faq_title) values
  ('home', '이용 안내 자세히 보기', '/guide', '자주 묻는 질문');

insert into public.landing_term_rows (page_slug, label, value, value_mobile, mono_prefix, note, note_mobile, desktop_only, sort_order) values
  ('home', '기준 가격', '', ' · 부가세 별도', '300,000~1,500,000원', '작품당 공급가 · 부가세 10% 별도', '', false, 0),
  ('home', '표준 변형', '리사이즈·리크롭, 카피·로고 영역 확보, 색감·톤 조정, 배경색 교체, 소품 1개 교체', '리사이즈·리크롭, 카피·로고 영역, 색감·톤, 배경색, 소품 1개 교체', null, null, null, false, 1),
  ('home', '수정 요청', '2회 포함 · 범위를 넘는 요청은 별도 견적', '2회 포함 · 범위를 넘으면 별도 견적', null, null, null, false, 2),
  ('home', '이용 조건', '온라인 광고·SNS · 1년 · 대한민국 · 비독점 (독점은 옵션)', '온라인 광고·SNS · 1년 · 대한민국 · 비독점', null, null, null, false, 3),
  ('home', '결제', '계좌이체(세금계산서 발행) 또는 카드 · 견적 유효 72시간', '계좌이체(세금계산서) 또는 카드 · 견적 유효 72시간', null, null, null, false, 4),
  ('home', '납기', '희망 납기일은 접수일로부터 3일 이후 · 확정 납기는 견적에 표시', null, null, null, null, true, 5);

insert into public.landing_faqs (page_slug, id, question, answer, answer_mobile, sort_order) values
  ('home', 'license', '생성한 이미지의 라이선스는 어떻게 되나요?', '견적에 매체·기간·지역·독점 여부를 명시하고, 납품 때 라이선스 증서 PDF를 드려요. 기본 조건은 온라인 광고·SNS, 1년, 대한민국, 비독점 이용이에요.', '견적에 매체·기간·지역·독점 여부를 명시하고, 납품 때 라이선스 증서 PDF를 드려요. 기본은 온라인 광고·SNS, 1년, 대한민국, 비독점이에요.', 0),
  ('home', 'revision', '수정은 몇 번까지 요청할 수 있나요?', '견적에 수정 요청 2회가 포함돼요. 구도·주제·인물 변경이나 새로 생성하는 요청은 표준 변형 범위를 넘어 별도 견적으로 안내드려요.', '수정 요청 2회가 포함돼요. 구도·주제·인물 변경이나 새로 생성하는 요청은 별도 견적으로 안내드려요.', 1),
  ('home', 'payment', '결제는 어떻게 하나요?', '계좌이체가 기본이고 세금계산서를 발행해 드려요. 카드 결제도 할 수 있어요. 견적은 발행 후 72시간 동안 유효해요.', '계좌이체가 기본이고 세금계산서를 발행해 드려요. 카드 결제도 할 수 있어요.', 2),
  ('home', 'refund', '취소하면 환불받을 수 있나요?', '크리에이터가 작업을 수락하기 전에는 전액, 수락 후 첫 제출 전에는 50%를 환불해 드려요. 첫 제출 이후에는 환불되지 않아요.', '작업 수락 전에는 전액, 수락 후 첫 제출 전에는 50%를 환불해 드려요. 첫 제출 이후에는 환불되지 않아요.', 3),
  ('home', 'deadline', '납기는 어떻게 정해지나요?', '희망 납기일은 브리프 접수일로부터 3일 이후로 선택할 수 있어요. 확정 납기일은 선택한 작품의 기준 납기를 반영해 견적에 적어 드려요.', '희망 납기일은 접수일로부터 3일 이후로 고를 수 있어요. 확정 납기일은 견적에 적어 드려요.', 4),
  ('home', 'contact', '크리에이터와 직접 연락할 수 있나요?', '고객과 크리에이터의 연락처는 서로 공개되지 않아요. 모든 소통은 프로젝트 코멘트로 운영팀을 거쳐 기록으로 남아요.', '연락처는 서로 공개되지 않아요. 모든 소통은 프로젝트 코멘트로 운영팀을 거쳐요.', 5);

insert into public.landing_final_ctas (page_slug, overline, title_lines, title_lines_mobile, description, primary_cta, secondary_cta_label, secondary_cta_href) values
  ('home', 'GET STARTED', array['다음 캠페인 브리프,', '지금 보내 보세요']::text[], array['다음 캠페인', '브리프, 지금', '보내 보세요']::text[], '가입 신청 후 영업일 1일 안에 검토해 이메일로 알려드려요.', '브리프 보내기', '로그인', '/login');

insert into public.landing_footers (page_slug, tagline, copyright, creator_contact_label, creator_contact_link_label, creator_contact_link_label_mobile, creator_contact_href) values
  ('home', '광고대행사를 위한 AI 이미지 광고 소재 관리형 제작 서비스', '© 2026 디지털플레이스', '크리에이터 문의', 'creators@example.com', '크리에이터 문의', 'mailto:creators@example.com');

insert into public.landing_footer_links (page_slug, label, href, sort_order) values
  ('home', '이용약관', '/legal/terms', 0),
  ('home', '개인정보처리방침', '/legal/privacy', 1);

insert into public.agency_applications (company, contact_name, email, agree_privacy) values
  ('데모 에이전시', '데모 담당자', 'demo@agency.co.kr', true)
on conflict ((lower(email))) do nothing;
