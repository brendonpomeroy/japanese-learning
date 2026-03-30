import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          to="/"
          className="text-accent-blue hover:text-accent-blue/80 mb-4 inline-flex items-center"
        >
          ← Back to Home
        </Link>
        <h1 className="text-4xl font-bold text-primary mb-4">About</h1>
      </div>

      <div className="max-w-2xl space-y-6 text-lg text-secondary">
        <p>I built this site to support my own Japanese learning journey.</p>

        <p>
          I've always found that the best way for me to learn is by creating
          tools I actually want to use. So this started as something just for
          me — a simple, practical way to practice consistently and focus on the
          areas I struggle with most.
        </p>

        <p>If you've found your way here, I hope it helps you too.</p>

        <p>
          I'm always tweaking and adding features as I learn more, so if
          there's something you'd like to see or think could be improved, feel
          free to reach out:
        </p>

        <p>
          👉{' '}
          <a
            href="https://www.linkedin.com/in/brendonrobertspomeroy/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-blue hover:text-accent-blue/80 underline"
          >
            linkedin.com/in/brendonrobertspomeroy
          </a>
        </p>
      </div>
    </div>
  );
};
