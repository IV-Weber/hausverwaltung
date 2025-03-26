import React from 'react';
import { Building } from 'lucide-react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center gap-2">
      <Building className="h-6 w-6 text-primary" />
      <div className="text-xl font-bold">HausWEG</div>
    </div>
  );
};

export default Logo;