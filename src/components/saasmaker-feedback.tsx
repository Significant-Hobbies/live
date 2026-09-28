'use client';

import '@saas-maker/feedback/dist/index.css';

import { FeedbackWidget, type FeedbackSubmission } from '@saas-maker/feedback';
import foundry from '../../foundry.json';

const FEEDBACK_PROJECT_KEY = foundry.projectKey.trim();
const FEEDBACK_API_URL = 'https://api.sassmaker.com/v1/feedback';

async function submitFeedback(submission: FeedbackSubmission): Promise<void> {
  const { screenshot, ...feedback } = submission;
  const body = new FormData();
  body.append(
    'feedback',
    JSON.stringify({
      type: feedback.type,
      title: feedback.title,
      description: feedback.description,
      submitter_email: feedback.email ?? '',
      submitter_name: feedback.name,
      page: feedback.page,
      anchor: feedback.anchor,
      source: 'widget',
      client_version: '0.4.0',
    })
  );
  if (screenshot) body.append('screenshot', screenshot);

  let response: Response;
  try {
    response = await fetch(FEEDBACK_API_URL, {
      method: 'POST',
      headers: { 'X-Project-Key': FEEDBACK_PROJECT_KEY },
      credentials: 'omit',
      body,
    });
  } catch (error) {
    const detail = error instanceof Error && error.message ? `: ${error.message}` : '';
    throw new Error(`Unable to reach the feedback service${detail}`, { cause: error });
  }
  if (!response.ok) throw new Error(`Feedback service returned HTTP ${response.status}.`);
}

export function SaaSMakerFeedback() {
  return (
    <>
      <FeedbackWidget onSubmit={submitFeedback} position="bottom-right" theme="auto" />
      <style>{`
        @media (max-width: 639px) {
          [data-feedback-widget] .smw-trigger {
            width: 44px;
            height: 44px;
            right: 8px;
            bottom: 8px;
            justify-content: center;
            padding: 0;
          }

          [data-feedback-widget] .smw-trigger__text {
            display: none;
          }
        }
      `}</style>
    </>
  );
}
