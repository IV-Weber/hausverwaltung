import { useRouter } from 'next/router';
import Logo from './Logo';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Building, Calendar, LayoutDashboard, Archive, Menu, Settings, HelpCircle, Users } from 'lucide-react';

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
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={() => router.push("/")}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Dashboard</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={() => router.push("/liegenschaften")}
          >
            <Building className="h-4 w-4" />
            <span>Liegenschaften</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={() => router.push("/kontakte")}
          >
            <Users className="h-4 w-4" />
            <span>Kontakte</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={() => router.push("/kalender")}
          >
            <Calendar className="h-4 w-4" />
            <span>Kalender</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={() => router.push("/archiv")}
          >
            <Archive className="h-4 w-4" />
            <span>Archiv</span>
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
                <DropdownMenuItem 
                  className="flex items-center gap-2"
                  onClick={() => router.push("/")}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="flex items-center gap-2"
                  onClick={() => router.push("/liegenschaften")}
                >
                  <Building className="h-4 w-4" />
                  <span>Liegenschaften</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="flex items-center gap-2"
                  onClick={() => router.push("/kontakte")}
                >
                  <Users className="h-4 w-4" />
                  <span>Kontakte</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="flex items-center gap-2"
                  onClick={() => router.push("/kalender")}
                >
                  <Calendar className="h-4 w-4" />
                  <span>Kalender</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="flex items-center gap-2"
                  onClick={() => router.push("/archiv")}
                >
                  <Archive className="h-4 w-4" />
                  <span>Archiv</span>
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