/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BadgeCheck } from 'lucide-react';

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
    quote: 'Very prompt in attending to issues and trustworthy. My father\'s funeral was organized very flamboyantly by them. Am grateful.',
    name: 'Samuel Agini',
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
    quote: 'Everyone was so kind, gentle and caring during a very sad time in my life. They truly listened to the little details I wanted to help my family and I express our love to our uncle.',
    name: 'Clara Nyarkoah Anim',
    context: 'Google Maps review',
    rating: 5
  },
  {
    quote: 'My experience with FamilyCare Funeral Trust has been amazing, especially with their prompt customer service, the quality of their funeral services and the location of your funeral not being a barrier to them.',
    name: 'Nana Kwesi',
    context: 'Google Maps review',
    rating: 5
  },
  {
    quote: 'I laid my head on their shoulders when I lost my dearest mother and everything they said was perfectly done.',
    name: 'Yaa Asantewah Obeng Opoku',
    context: 'Google Maps review',
    rating: 5
  },
  {
    quote: 'Your policy is outstanding and funeral event planning is one of a kind. I will recommend you every time.',
    name: 'Daniel Obiri',
    context: 'Google Maps review',
    rating: 5
  },
  {
    quote: 'FamilyCare is the best funeral and cemetery services in Ghana. I recommend you subscribe to their prepayment plan, which is affordable for all.',
    name: 'Samuel Addo',
    context: 'Google Maps review',
    rating: 5
  },
  {
    quote: 'Very fantastic customer relation services, especially the Koforidua branch. My encounter with them has been excellent, particularly Sis Cynthia Osei Sarfo.',
    name: 'hayford yaw',
    context: 'Google Maps review',
    rating: 5
  },
  {
    quote: 'A good life deserves a good farewell. Join FamilyCare today for all your funeral and cemetery services at an affordable cost. Today\'s wisdom is INDEED tomorrow\'s peace of mind.',
    name: 'joseph mensah',
    context: 'Google Maps review',
    rating: 5
  },
  {
    quote: 'FamilyCare was with me all the way when I lost my dad. They provided the promised services and nothing short. They were flexible to do what my family wanted.',
    name: 'CALEB AMENKU',
    context: 'Google Maps review',
    rating: 5
  },
  {
    quote: "In the beginning I thought it was one of those, but 5 years on I can say it is here to stay with us. This is a reliable package you can invest in for tomorrow's peace of mind.",
    name: 'WHITE BEAM CONCEPTS',
    context: 'Google Maps review',
    rating: 5
  },
  {
    quote: 'The best funeral policy in Ghana with excellent services that guarantees client satisfaction and peace of mind during the most difficult time.',
    name: 'MICHAEL ODUETEY',
    context: 'Google Maps review',
    rating: 5
  },
  {
    quote: 'Well, very nice people especially Cynthia Osei Osafo. She really cares for her customers.',
    name: 'Isaac Mante Acquah',
    context: 'Google Maps review',
    rating: 5
  },
  {
    quote: 'Familycare provides great funeral and burial services. You can check out our testimonials on our YouTube account.',
    name: 'Michelle Y. Deri',
    context: 'Google Maps review',
    rating: 5
  },
  {
    quote: 'I really enjoy your customer relationship, especially from my relationship officer Foster Asomani. Thanks for this assistance.',
    name: 'Jesse Addo',
    context: 'Google Maps review',
    rating: 5
  },
  {
    quote: "The service was okay, first time seeing such a thing in Ghana and it's a good thing. Keep it up.",
    name: 'Abigail Nortey',
    context: 'Google Maps review',
    rating: 5
  },
  {
    quote: 'Irrespective of the location of your hometown or religion, FamilyCare delivers up to your standards. FamilyCare all the way.',
    name: 'Owusu-Ansah Paul',
    context: 'Google Maps review',
    rating: 5
  },
  {
    quote: 'Great customer service, affable staff! Simply the best at what they do.',
    name: 'Benjamin PKC Danquah',
    context: 'Google Maps review',
    rating: 5
  },
  {
    quote: 'No need to worry about how to organize funerals. Ask me how? Don\'t borrow money.',
    name: 'M Anochi',
    context: 'Google Maps review',
    rating: 5
  },
  {
    quote: 'The burden and stress of planning and executing a funeral when you lose a loved one is greatly reduced with FamilyCare! Thank you for what you do.',
    name: 'Colouredby PKC',
    context: 'Google Maps review',
    rating: 5
  }
];

const GOOGLE_REVIEWS_URL = 'https://maps.app.goo.gl/RwtNcH661TzYbdE19?g_st=ic';

type CardVariant = 'standard' | 'featured';

function TestimonialCard({ testimonial, variant = 'standard' }: { testimonial: Testimonial; variant?: CardVariant }) {
  const isFeatured = variant === 'featured';

  return (
    <figure
      className={`${isFeatured ? 'w-[20rem]' : 'w-[16rem]'} h-56 shrink-0 bg-white rounded-card border border-hairline border-l-2 border-l-accent p-5 flex flex-col shadow-[0_8px_24px_rgba(11,61,38,0.08)]`}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="font-display text-4xl leading-none text-accent" aria-hidden="true">
          &ldquo;
        </span>
        {isFeatured ? (
          <span className="block text-sm leading-none" aria-label={`${testimonial.rating} out of 5 stars`}>
            <span className="text-amber-400">{'★'.repeat(testimonial.rating)}</span>
            <span className="text-hairline">{'★'.repeat(5 - testimonial.rating)}</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/10 text-accent-deep text-[10px] font-semibold shrink-0">
            <BadgeCheck className="w-3 h-3" aria-hidden="true" />
            {testimonial.context}
          </span>
        )}
      </div>

      <blockquote
        className={`${isFeatured ? 'text-sm line-clamp-5' : 'text-xs line-clamp-4'} leading-relaxed mt-1 text-body`}
      >
        {testimonial.quote}
      </blockquote>

      <figcaption className="mt-auto pt-3 border-t border-hairline">
        <span className="font-semibold text-ink block text-xs">{testimonial.name}</span>
        {isFeatured ? (
          <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-accent/10 text-accent-deep text-[10px] font-semibold">
            <BadgeCheck className="w-3 h-3" aria-hidden="true" />
            {testimonial.context}
          </span>
        ) : (
          <span className="block text-sm leading-none mt-1" aria-label={`${testimonial.rating} out of 5 stars`}>
            <span className="text-amber-400">{'★'.repeat(testimonial.rating)}</span>
            <span className="text-hairline">{'★'.repeat(5 - testimonial.rating)}</span>
          </span>
        )}
      </figcaption>
    </figure>
  );
}

function MarqueeRow({ testimonials, reverse = false }: { testimonials: Testimonial[]; reverse?: boolean }) {
  const VARIANTS: CardVariant[] = ['standard', 'featured'];

  return (
    <div className="marquee-viewport relative overflow-hidden">
      <div className={`marquee-track ${reverse ? 'marquee-reverse' : ''}`}>
        {testimonials.map((testimonial, index) => (
          <TestimonialCard
            key={testimonial.name}
            testimonial={testimonial}
            variant={VARIANTS[index % VARIANTS.length]}
          />
        ))}
        {/* Duplicate set for the seamless loop; hidden from screen readers */}
        {testimonials.map((testimonial, index) => (
          <div key={`${testimonial.name}-dup`} aria-hidden="true" className="marquee-duplicate">
            <TestimonialCard testimonial={testimonial} variant={VARIANTS[index % VARIANTS.length]} />
          </div>
        ))}
      </div>
      {/* Edge fades so the clipped cards read as intentional */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-10 sm:w-20 bg-gradient-to-r from-tint to-transparent pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute inset-y-0 right-0 w-10 sm:w-20 bg-gradient-to-l from-tint to-transparent pointer-events-none"
      />
    </div>
  );
}

export const Testimonials: React.FC = () => {
  if (TESTIMONIALS.length === 0) {
    return null;
  }

  const midPoint = Math.ceil(TESTIMONIALS.length / 2);
  const rowOne = TESTIMONIALS.slice(0, midPoint);
  const rowTwo = TESTIMONIALS.slice(midPoint);

  return (
    <div className="mt-16 sm:mt-20 space-y-8">
      <div className="text-center max-w-2xl mx-auto px-4 space-y-2">
        <h3 className="font-display text-2xl sm:text-3xl font-bold text-ink">
          What families say
        </h3>
        <p className="text-xs sm:text-sm text-muted">
          Reviews shared by families on Google Maps.
        </p>
      </div>

      <div className="marquee-paused space-y-6">
        <MarqueeRow testimonials={rowOne} />
        <MarqueeRow testimonials={rowTwo} reverse />
      </div>

      <div className="text-center">
        <a
          href={GOOGLE_REVIEWS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-semibold text-accent-deep hover:text-ink transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
        >
          Read more reviews on Google Maps
        </a>
      </div>
    </div>
  );
};
