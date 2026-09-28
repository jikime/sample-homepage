"use client"

import * as React from "react"
import { CheckIcon } from "lucide-react"
import { cn } from "@/lib/utils"

import { formatWon } from "@/lib/format"
import type { Artwork, Candidate, CompareExample as CompareExampleData, Responsive } from "@/lib/landing/types"

import { ArtworkFrame } from "./artwork-frame"
import { Rt } from "./primitives"

type CandidateView = Candidate & { artwork: Artwork }

/**
 * CandidateCompareTable 예시 — design.md §12
 * 열 = 후보, 행 = 비교정보 7항목(순서·라벨 고정). lg 이상 표, 미만 후보별 카드 스택.
 * 화살표 키 없이 Tab + Enter/Space만으로 고를 수 있다.
 */
export function CompareExample({
  example,
  artworks,
}: {
  example: CompareExampleData
  artworks: Record<string, Artwork>
}) {
  const [selectedId, setSelectedId] = React.useState(example.defaultSelectedId)
  const candidates: CandidateView[] = example.candidates.map((candidate) => ({
    ...candidate,
    artwork: artworks[candidate.artworkId]!,
  }))
  const labels = example.rowLabels

  return (
    <div className="flex flex-col gap-6 lg:gap-3">
      <p className="text-caption text-muted-foreground">
        <Rt value={example.caption} />
      </p>

      {/* 데스크톱: 표 */}
      <div
        role="radiogroup"
        aria-label="후보 비교 예시 — 후보를 눌러 선택해 보세요"
        className="grid grid-cols-[11.5rem_repeat(3,minmax(0,1fr))] grid-rows-[4.75rem_12.5rem_repeat(3,minmax(4.5rem,auto))_repeat(2,minmax(3.5rem,auto))_minmax(4.5rem,auto)] gap-x-4 max-lg:hidden"
      >
        <div aria-hidden className="row-span-8 grid grid-rows-subgrid">
          <div />
          {labels.map((label) => (
            <div key={label.base} className="flex items-center border-t border-border text-caption text-muted-foreground">
              {label.base}
            </div>
          ))}
        </div>
        {candidates.map((candidate) => (
          <DesktopColumn
            key={candidate.id}
            candidate={candidate}
            labels={labels}
            selected={candidate.id === selectedId}
            onSelect={() => setSelectedId(candidate.id)}
          />
        ))}
      </div>

      {/* 모바일·태블릿: 선택한 후보를 펼친 카드 + 나머지 요약 */}
      <div role="radiogroup" aria-label="후보 비교 예시 — 후보를 눌러 선택해 보세요" className="flex flex-col gap-6 lg:hidden">
        {[...candidates]
          .sort((a, b) => Number(b.id === selectedId) - Number(a.id === selectedId) || a.order - b.order)
          .map((candidate) =>
            candidate.id === selectedId ? (
              <MobileSelectedCard key={candidate.id} candidate={candidate} labels={labels} />
            ) : (
              <MobileSummaryCard key={candidate.id} candidate={candidate} onSelect={() => setSelectedId(candidate.id)} />
            )
          )}
      </div>
    </div>
  )
}

function candidateLabel(candidate: CandidateView) {
  return `후보 ${candidate.order} ${candidate.artwork.title}, ${formatWon(candidate.basePrice)}, 영업일 ${candidate.leadDays}일`
}

function selectOnKey(onSelect: () => void) {
  return (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      onSelect()
    }
  }
}

function SelectedBadge() {
  return (
    <span className="absolute top-4 right-4 flex h-6 items-center gap-1 rounded-sm bg-primary px-2 text-caption text-primary-foreground">
      <CheckIcon className="size-3.5" strokeWidth={2} aria-hidden />
      선택됨
    </span>
  )
}

function DesktopColumn({
  candidate,
  labels,
  selected,
  onSelect,
}: {
  candidate: CandidateView
  labels: Responsive<string>[]
  selected: boolean
  onSelect: () => void
}) {
  const cell = "flex items-center border-t border-border text-body-sm"
  const text = selected ? "text-foreground" : "text-sub"

  return (
    <div
      role="radio"
      aria-checked={selected}
      aria-label={candidateLabel(candidate)}
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={selectOnKey(onSelect)}
      className={cn(
        "relative row-span-8 grid grid-rows-subgrid rounded-lg transition-colors duration-120 ease-enter",
        selected
          ? "border-2 border-primary bg-primary-subtle px-3.75"
          : "border border-border bg-surface px-4 hover:border-muted-foreground"
      )}
    >
      {selected ? <SelectedBadge /> : null}
      <div className="flex flex-col justify-center gap-0.5">
        <span className={cn("text-caption", selected ? "text-sub" : "text-muted-foreground")}>
          후보 {candidate.order}
        </span>
        <span className="text-h3 tracking-normal">{candidate.artwork.title}</span>
      </div>
      <div className="border-t border-border py-3">
        <ArtworkFrame
          artwork={candidate.artwork}
          image={candidate.artwork}
          className="h-full"
          sizes="(min-width: 1280px) 330px, 25vw"
        />
      </div>
      <div className={cn(cell, text)}>
        <span className="sr-only">{labels[1]?.base}: </span>
        {candidate.qualityNote.base}
      </div>
      <div className={cn(cell, text)}>
        <span className="sr-only">{labels[2]?.base}: </span>
        {candidate.generation.base}
      </div>
      <div className={cn(cell, text)}>
        <span className="sr-only">{labels[3]?.base}: </span>
        {candidate.variations.base}
      </div>
      <div className={cn(cell, "font-mono text-mono tabular-nums")}>
        <span className="sr-only">{labels[4]?.base}: </span>
        {formatWon(candidate.basePrice)}
      </div>
      <div className={cell}>
        <span className="sr-only">{labels[5]?.base}: </span>
        영업일 {candidate.leadDays}일
      </div>
      <div className={cn(cell, text)}>
        <span className="sr-only">{labels[6]?.base}: </span>
        {candidate.license}
      </div>
    </div>
  )
}

function MobileSelectedCard({ candidate, labels }: { candidate: CandidateView; labels: Responsive<string>[] }) {
  const label = (index: number) => labels[index]?.mobile ?? labels[index]?.base
  const rows: { label?: string; value: React.ReactNode; mono?: boolean }[] = [
    { label: label(1), value: candidate.qualityNote.mobile ?? candidate.qualityNote.base },
    { label: label(2), value: candidate.generation.mobile ?? candidate.generation.base },
    { label: label(3), value: candidate.variations.mobile ?? candidate.variations.base },
    { label: label(4), value: formatWon(candidate.basePrice), mono: true },
    { label: label(5), value: `영업일 ${candidate.leadDays}일` },
    { label: label(6), value: candidate.license },
  ]

  return (
    <div
      role="radio"
      aria-checked
      aria-label={candidateLabel(candidate)}
      tabIndex={0}
      className="relative flex animate-in flex-col gap-3 rounded-lg border-2 border-primary bg-primary-subtle p-3.75 duration-180 fade-in-0"
    >
      <SelectedBadge />
      <div className="flex flex-col gap-0.5">
        <span className="text-caption text-sub">후보 {candidate.order}</span>
        <span className="text-h3 tracking-normal">{candidate.artwork.title}</span>
      </div>
      <figure className="flex flex-col gap-2">
        <ArtworkFrame artwork={candidate.artwork} image={candidate.artwork} className="h-50" sizes="90vw" inset />
        <figcaption className="text-caption text-sub">
          {label(0)} · <span className="font-mono">{candidate.artwork.sizeLabel}</span>
        </figcaption>
      </figure>
      <dl className="flex flex-col">
        {rows.map((row) => (
          <div
            key={row.label}
            className="grid grid-cols-[6rem_minmax(0,1fr)] gap-3 border-t border-border py-2.5 last:pb-0"
          >
            <dt className="text-caption leading-5 text-sub">{row.label}</dt>
            <dd className={cn("text-body-sm", row.mono && "font-mono text-mono tabular-nums")}>{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

function MobileSummaryCard({ candidate, onSelect }: { candidate: CandidateView; onSelect: () => void }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={false}
      aria-label={candidateLabel(candidate)}
      onClick={onSelect}
      className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface p-4 text-left transition-colors duration-120 ease-enter hover:border-muted-foreground"
    >
      <span className="flex flex-col gap-0.5">
        <span className="text-caption text-muted-foreground">후보 {candidate.order}</span>
        <span className="text-body font-semibold">{candidate.artwork.title}</span>
      </span>
      <span className="font-mono text-mono whitespace-nowrap text-sub tabular-nums">
        {formatWon(candidate.basePrice)} · {candidate.leadDays}일
      </span>
    </button>
  )
}
