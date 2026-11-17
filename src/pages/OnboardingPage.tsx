//import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { IntroStep } from '../pages/onboarding/Introstep';
// import { ConditionStep } from '../pages/onboarding/ConditionStep';
// import { NeedsStep } from './onboarding/NeedsStep';
import { MobileLayout } from '../layouts/MobileLayout';

export default function OnboardingPage() {
  const navigate = useNavigate();
  //const [step, setStep] = useState(0);

  // const nextStep = () => {
  //   if (step < 2) {
  //     setStep((prev) => prev + 1);
  //   } else {
  //     navigate('/login');
  //   }
  // };

  const handleIntroNext = () => {
    navigate('/login', { replace: true });
  };

  return (
    <MobileLayout>
      <div className="flex min-h-0 w-full flex-1 flex-col bg-background">
        {<IntroStep onNext={handleIntroNext} />}
      </div>
    </MobileLayout>
  );
}