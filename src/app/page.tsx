import { ApplyDialogProvider } from "@/components/landing/apply-dialog"
import { CompareSection } from "@/components/landing/compare-section"
import { FinalCtaSection } from "@/components/landing/final-cta-section"
import { HeroSection } from "@/components/landing/hero-section"
import { ProblemSection } from "@/components/landing/problem-section"
import { ProcessSection } from "@/components/landing/process-section"
import { RulesSection } from "@/components/landing/rules-section"
import { SamplesSection } from "@/components/landing/samples-section"
import { SiteFooter } from "@/components/landing/site-footer"
import { SiteHeader } from "@/components/landing/site-header"
import { TermsSection } from "@/components/landing/terms-section"
import { getLandingContent } from "@/lib/landing/get-landing-content"

// Supabase 콘텐츠를 고치면 최대 60초 뒤 페이지에 반영된다(ISR). 목업 모드에서는 영향 없음.
export const revalidate = 60

/** P-01 랜딩 */
export default async function LandingPage() {
  const content = await getLandingContent()

  return (
    <ApplyDialogProvider>
      <a
        href="#main"
        className="sr-only rounded-md bg-surface-raised px-4 py-3 text-body font-semibold focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-(--z-toast)"
      >
        본문으로 건너뛰기
      </a>
      <div className="flex min-h-dvh flex-col">
        <SiteHeader nav={content.nav} loginHref={content.loginHref} ctaLabel={content.hero.primaryCta} />
        <main id="main">
          <HeroSection hero={content.hero} artworks={content} />
          <ProblemSection problem={content.problem} />
          <ProcessSection process={content.process} />
          <CompareSection compare={content.compare} artworks={content.artworks} />
          <SamplesSection samples={content.samples} artworks={content.artworks} />
          <RulesSection rules={content.rules} />
          <TermsSection terms={content.terms} />
          <FinalCtaSection finalCta={content.finalCta} />
        </main>
        <SiteFooter footer={content.footer} />
      </div>
    </ApplyDialogProvider>
  )
}
