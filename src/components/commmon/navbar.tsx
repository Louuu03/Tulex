import { Flex, IconButton, useMediaQuery } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { ReactElement, useMemo } from 'react';
import {
  BsChatSquareDots,
  BsChatRightDotsFill,
  BsFlag,
  BsFlagFill,
} from 'react-icons/bs';
import { RiPagesLine, RiPagesFill } from 'react-icons/ri';
import {
  IoHomeOutline,
  IoHome,
  IoSettingsOutline,
  IoSettings,
} from 'react-icons/io5';

interface NavItemProps {
  icon: ReactElement;
  activeIcon: ReactElement;
  route: string;
  isCurrent: (path: string) => boolean;
}

const NavItem: React.FC<NavItemProps> = ({
  icon,
  activeIcon,
  route,
  isCurrent,
}) => {
  const router = useRouter();

  return (
    <IconButton
      aria-label='Navigation Button'
      icon={isCurrent(route) ? activeIcon : icon}
      onClick={() => router.push(route)}
      background={isCurrent(route) ? '#eee3bac2' : 'none'}
      variant='ghost'
      size='lg'
      borderRadius={'50%'}
    />
  );
};

const Navbar: React.FC = () => {
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const router = useRouter();

  const isCurrent = (path: string): boolean => {
    return router.pathname === path;
  };

  const navItems = useMemo(() => {
    // Define your nav items here
    const items = [
      { icon: <IoHomeOutline />, activeIcon: <IoHome />, route: '/app' },
      {
        icon: <BsChatSquareDots />,
        activeIcon: <BsChatRightDotsFill />,
        route: '/app/speaking',
      },
      {
        icon: <RiPagesLine />,
        activeIcon: <RiPagesFill />,
        route: '/app/writing',
      },
      {
        icon: <BsFlag />,
        activeIcon: <BsFlagFill />,
        route: '/app/leaderboard',
      },
      {
        icon: <IoSettingsOutline />,
        activeIcon: <IoSettings />,
        route: '/app/settings',
      },
    ];

    // Change the order for desktop
    if (isLargerThan768) {
      return [
        items[0], // Home
        items[1], // Speaking
        items[2], // Writing
        items[3], // Leaderboard
        items[4], // Settings
      ];
    }

    // Mobile order
    return [
      items[1], // Speaking
      items[2], // Writing
      items[0], // Home
      items[3], // Leaderboard
      items[4], // Settings
    ];
  }, [isLargerThan768]);

  return (
    <Flex
      direction={isLargerThan768 ? 'column' : 'row'}
      position='fixed'
      bottom={isLargerThan768 ? 'initial' : '-1px'}
      left={isLargerThan768 ? '0' : 'initial'}
      top={isLargerThan768 ? '0' : 'initial'}
      height={isLargerThan768 ? '100vh' : 'initial'}
      width={isLargerThan768 ? '65px' : '100vw'}
      bg='white'
      align='center'
      justify={isLargerThan768 ? 'start' : 'space-around'}
      padding={isLargerThan768 ? '4' : '2'}
      boxShadow={
        isLargerThan768
          ? '2px 0 10px rgba(0, 0, 0, 0.05)'
          : '0 -2px 10px rgba(0, 0, 0, 0.05)'
      }
      zIndex={100}
    >
      {navItems.map((item, index) => (
        <NavItem key={index} {...item} isCurrent={isCurrent} />
      ))}
    </Flex>
  );
};

export default Navbar;
