import { useRouter } from 'next/router';
import Logo from './Logo';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Building, Users, Wallet, Wrench, FileText, Calendar, Menu, Settings, HelpCircle } from 'lucide-react';

const Header = () => {
  const router = useRouter();

  return (
    <div className="w-full border-b">
      <div className="flex justify-between items-center py-3 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <div className="cursor-pointer" onClick={() => router.push("/")}>
            <Logo />
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <Building className="h-4 w-4" />
            <span>Immobilien</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>Personen</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <Wallet className="h-4 w-4" />
            <span>Finanzen</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <Wrench className="h-4 w-4" />
            <span>Instandhaltung</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            <span>Dokumente</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>Versammlungen</span>
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <HelpCircle className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
          
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  <span>Immobilien</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>Personen</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2">
                  <Wallet className="h-4 w-4" />
                  <span>Finanzen</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2">
                  <Wrench className="h-4 w-4" />
                  <span>Instandhaltung</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Dokumente</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Versammlungen</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;