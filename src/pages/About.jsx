import { FiAward, FiFlag, FiUserCheck } from 'react-icons/fi';
import PageHeader from '../components/PageHeader';

function About() {
  return (
    <div>
      <PageHeader
        title="About Election Management System"
        subtitle="A secure and efficient platform for managing elections digitally."
      />

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="space-y-4 text-sm leading-relaxed text-gray-600 sm:text-base">
          <p>
            The Election Management System is a comprehensive digital platform
            designed to support the full lifecycle of national elections. It
            brings together election planning, party and candidate registration,
            voter enrollment, secure ballot casting, and official result
            publication into one coordinated system.
          </p>

          <p>
            The primary purpose of this system is to modernize election
            administration by replacing fragmented, paper-based processes with a
            structured and accountable digital workflow. Election officials can
            manage every aspect of an election cycle with greater confidence,
            consistency, and control.
          </p>

          <p>
            By centralizing election data and standardizing administrative
            procedures, the platform helps election authorities reduce errors,
            improve oversight, and deliver fair and well-organized elections.
            From voter registration to final results, the system supports
            transparent and efficient election governance.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-surface p-4 text-center">
            <FiFlag className="mx-auto text-primary" size={24} />
            <p className="mt-2 text-sm font-semibold text-gray-800">
              End-to-End Coverage
            </p>
            <p className="mt-1 text-xs text-gray-500">From setup to results</p>
          </div>

          <div className="rounded-xl bg-surface p-4 text-center">
            <FiUserCheck className="mx-auto text-primary" size={24} />
            <p className="mt-2 text-sm font-semibold text-gray-800">
              Verified Records
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Accurate voter and candidate data
            </p>
          </div>

          <div className="rounded-xl bg-surface p-4 text-center">
            <FiAward className="mx-auto text-primary" size={24} />
            <p className="mt-2 text-sm font-semibold text-gray-800">
              Official Outcomes
            </p>
            <p className="mt-1 text-xs text-gray-500">Trusted election results</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
