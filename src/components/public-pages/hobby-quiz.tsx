import { SpotlightCard } from '~/components/aceternity';
import { QUESTIONS } from '~/lib/hobby-quiz-questions';
export function QuizQuestions({
  step,
  selectedOption,
  handleSelect,
  handleNext,
  includeHeader = true,
}: {
  step: number;
  selectedOption: number | null;
  handleSelect: (index: number) => void;
  handleNext: () => void;
  includeHeader?: boolean;
}) {
  const isResults = false;
  const currentQuestion = QUESTIONS[step];
  return (
    <>
      {' '}
      {/* Header */}
      {!isResults && includeHeader && (
        <div className="mb-10 rounded-2xl bg-card px-6 py-9 text-center shadow-[0_12px_36px_color-mix(in_srgb,var(--scrim)_10%,transparent)] sm:px-10">
          <p className="text-base font-bold text-field-sky-ink">Find a hobby</p>
          <h1 className="mt-3 font-serif text-5xl font-medium leading-[1.02] tracking-[-0.03em] text-foreground sm:text-6xl">
            Find Your Perfect Hobby
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
            Nine focused questions, about three minutes, and a shortlist built around how you
            actually like to spend your time.
          </p>
        </div>
      )}
      {/* Progress indicator */}
      {!isResults && (
        <div className="mb-8 flex items-center justify-center gap-2">
          {QUESTIONS.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i < step
                  ? 'w-8 bg-foreground'
                  : i === step
                    ? 'w-8 bg-foreground/60'
                    : 'w-4 bg-foreground/10'
              }`}
            />
          ))}
        </div>
      )}
      {/* Quiz question */}
      {!isResults && currentQuestion && (
        <div key={step} className="animate-in fade-in slide-in-from-right-4 duration-300">
          <SpotlightCard
            className="rounded-2xl border-0 bg-card shadow-[0_12px_36px_color-mix(in_srgb,var(--scrim)_12%,transparent)]"
            innerClassName="p-6 sm:p-9"
          >
            <div className="mb-3 text-center text-base font-medium text-subtle">
              Question {step + 1} of {QUESTIONS.length}
            </div>
            <h2 className="mb-8 text-center font-serif text-3xl font-medium text-foreground">
              {currentQuestion.question}
            </h2>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {currentQuestion.options.map((option, i) => {
                const isSelected = selectedOption === i;
                const OptionIcon = option.icon;
                return (
                  <button
                    key={i}
                    data-quiz-option
                    onClick={() => handleSelect(i)}
                    className={`flex min-h-16 items-center gap-3 rounded-xl border-2 p-4 text-left transition-all duration-150 hover:border-field-sky-ink hover:bg-field-sky focus:outline-none focus:ring-2 focus:ring-field-sky-ink focus:ring-offset-2 ${
                      isSelected
                        ? 'border-foreground/30 bg-foreground/10 shadow-sm'
                        : 'border-border bg-card'
                    }`}
                  >
                    <OptionIcon
                      className={`h-4 w-4 shrink-0 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`}
                      aria-hidden="true"
                    />
                    <span
                      className={`text-base font-medium ${
                        isSelected ? 'text-foreground' : 'text-foreground'
                      }`}
                    >
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex justify-center">
              <button
                onClick={handleNext}
                disabled={selectedOption === null}
                className={`rounded-lg px-8 py-3 text-sm font-semibold transition-all duration-150 ${
                  selectedOption !== null
                    ? 'bg-primary text-primary-foreground hover:opacity-90 shadow-sm hover:shadow-md'
                    : 'cursor-not-allowed bg-foreground/5 text-subtle'
                }`}
              >
                {step === QUESTIONS.length - 1 ? 'See my results →' : 'Next →'}
              </button>
            </div>
          </SpotlightCard>
        </div>
      )}
    </>
  );
}
