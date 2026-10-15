/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Quote } from 'lucide-react';

export interface Testimonial {
  quote: string;
  name: string;
  context: string;
  rating: number;
}

/**
 * Real customer reviews from the company's Google Maps listing
 * (https://maps.app.goo.gl/RwtNcH661TzYbdE19), lightly trimmed for
 * length; full reviews remain on Google Maps.
 */
export const TESTIMONIALS: Testimonial[] = [
  {
    quote: 'Everyone was so kind, gentle and caring during a very sad time in my life. They truly listened to the little details I wanted to help my family and I express our love to our uncle.',
    name: 'Clara Nyarkoah Anim',
    context: 'Google Maps review',
    rating: 5
  },
  {
    quote: "At first, I doubted their promises. I said to myself, this is too good to be true but sincerely, they've won my heart.",
    name: 'Ike Gee kpodzo',
    context: 'Google Maps review',
    rating: 5
  },
  {
    quote: 'I laid my head on their shoulders when I lost my dearest mother and everything they said was perfectly done.',
    name: 'Yaa Asantewah Obeng Opoku',
    context: 'Google Maps review',
    rating: 5
  }
];

const GOOGLE_REVIEWS_URL = 'https://maps.app.goo.gl/RwtNcH661TzYbdE19?g_st=ic';

export const Testimonials: React.FC = () => {
  if (TESTIMONIALS.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h3 className="font-display text-2xl sm:text-3xl font-bold text-ink">
          What families say
        </h3>
        <p className="text-xs sm:text-sm text-muted">
          Reviews shared by families on Google Maps.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TESTIMONIALS.map((testimonial) => (
          <figure
            key={testimonial.name}
            className="bg-white rounded-card border border-hairline p-6 space-y-4 flex flex-col justify-between"
          >
            <div>
              <Quote className="w-5 h-5 text-accent mb-3" aria-hidden="true" />
              <blockquote className="text-xs sm:text-sm text-body leading-relaxed">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
            </div>
            <figcaption className="text-xs text-muted pt-3 border-t border-hairline">
              <span className="font-semibold text-ink block">{testimonial.name}</span>
              <span className="block" aria-label={`${testimonial.rating} out of 5 stars`}>
                {'★'.repeat(testimonial.rating)}
                <span className="text-hairline">{'★'.repeat(5 - testimonial.rating)}</span>
              </span>
              {testimonial.context}
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="text-center">
        <a
          href={GOOGLE_REVIEWS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-semibold text-deep hover:text-accent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
        >
          Read more reviews on Google Maps
        </a>
      </div>
    </div>
  );
};
