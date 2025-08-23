import type { ReactElement } from 'react';
import { FaCheckCircle, FaCogs, FaDocker } from 'react-icons/fa';

function WhyPowerFlowCard({
  title,
  desc,
  icon,
}: {
  title: string;
  desc: string;
  icon: ReactElement;
}) {
  return (
    <div className="bg-card text-card-foreground p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-center w-12 h-12 bg-primary/10 text-primary rounded-full mb-4 mx-auto">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{desc}</p>
    </div>
  );
}

export function WhyPowerFlowSection() {
  return (
    <section className="relative py-20" id="why-powerflow">
      <div className="container mx-auto max-w-screen-xl px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Vite PowerFlow?</h2>
        <p className="text-lg text-muted-foreground mb-12 max-w-3xl mx-auto">
          Vite PowerFlow is designed to help teams and solo developers ship high-quality
          applications faster. It includes everything you need to start a new project with
          confidence: a modern stack, strict code quality, CI/CD, testing, and a dev container for a
          reproducible environment.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <WhyPowerFlowCard
            title="Production-Ready"
            desc="Built with best practices, strict linting, and automated testing to ensure your app is robust and maintainable."
            icon={<FaCheckCircle className="w-6 h-6" />}
          />
          <WhyPowerFlowCard
            title="Dev Container"
            desc="Pre-configured Docker environment for consistent, reproducible development across all machines."
            icon={<FaDocker className="w-6 h-6" />}
          />
          <WhyPowerFlowCard
            title="Automated CI/CD"
            desc="GitHub Actions workflows for testing, building, and deploying your app with ease."
            icon={<FaCogs className="w-6 h-6" />}
          />
        </div>
      </div>
    </section>
  );
}
