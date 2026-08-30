import { SearchBox } from '@/components/app';
import { useEffect, useState } from 'react';
import { useAppContext } from '@contexts';
import { Login, Signup } from '@pages/app';
import { ChatBot } from '@components/users';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { UserInformation } from '@components/users';
import {
  BsFillBagFill,
  BsGeoAltFill,
  BsSignTurnRightFill,
} from 'react-icons/bs';
import {
  Layout,
  Typography,
  Button,
  Flex,
  Spin,
  Dropdown,
  Card,
  Drawer,
  Image,
  Collapse,
} from 'antd';
import FooterComponent from './footer';
import '@styles/users-layout.css';
import ForgotPasswordModal from '@/pages/app/forgotPassword';
import Branchs from '@/services/branches';
function Header() {
  const { Panel } = Collapse;
  const { setShowLogin, setShowSignup, user, message, setShowForgotPassword } =
    useAppContext();
  const navigate = useNavigate();
  const [allBrands, setAllBrands] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const Text = Typography;
  useEffect(() => {
    document.title = 'TechShop | Mua sắm thả ga';

    fetchBranchs();
  }, []);

  const fetchBranchs = async () => {
    try {
      const res = await Branchs.getAll();
      setAllBrands(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  ///Địa chỉ chi nhánh
  const items = allBrands.map((branch, index) => ({
    key: index.toString(),
    label: (
      <Card className="sm:p-4 flex! gap-8! border-none!">
        <Typography.Title level={5} className="mb-4!">
          {branch.name}
        </Typography.Title>
        <Text className="block! text-sm! sm:text-base mb-8!">
          {branch.address}
        </Text>
        <Button
          icon={<BsSignTurnRightFill />}
          type="primary"
          className="flex! items-center! justify-center! py-2 sm:py-4 px-4 sm:px-6 w-full sm:w-auto shadow-none! rounded-full! border-none! text-white font-medium!"
          onClick={() => {
            navigator.geolocation.getCurrentPosition((position) => {
              const origin = `${position.coords.latitude},${position.coords.longitude}`;
              const destination = '16.163951015563573,107.69555685335028';
              const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;
              window.open(url, '_blank');
            });
          }}
        >
          Xem chỉ đường
        </Button>
      </Card>
    ),
  }));

  const drawerBranchItems = [{
    key: '1',
    label: <span className='font-medium'>Chi nhánh</span>,
    children: allBrands.map((branch, index) => (<Card className="sm:p-4 flex! gap-8! border-none!">
      <Typography.Title level={5} className="mb-4!">
        {branch.name}
      </Typography.Title>
      <Text className="block! text-sm! sm:text-base mb-8!">
        {branch.address}
      </Text>
      <Button
        icon={<BsSignTurnRightFill />}
        type="primary"
        className="flex! items-center! justify-center! py-2 sm:py-4 px-4 sm:px-6 w-full sm:w-auto shadow-none! rounded-full! border-none! text-white font-medium!"
        onClick={() => {
          navigator.geolocation.getCurrentPosition((position) => {
            const origin = `${position.coords.latitude},${position.coords.longitude}`;
            const destination = '16.163951015563573,107.69555685335028';
            const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;
            window.open(url, '_blank');
          });
        }}
      >
        Xem chỉ đường
      </Button>
    </Card>))
  }

  ];

  return (
    <Layout.Header className="print:hidden! font-inter! p-8! lg:px-4! w-full! fixed! top-0! left-0! right-0! z-[99]! lg:p-10! bg-gradient-primary-to-secondary! xl:h-70! flex! flex-col! lg:flex-row! items-center! justify-center! border-b! border-gray-200! h-auto! min-h-[60px]! lg:h-20!">
      <div className="w-full lg:w-5/6 flex items-center justify-between gap-2 lg:gap-4 mb-2 lg:mb-0">

        {/* HAMBURGER MENU (MOBILE) */}
        <div className="lg:hidden flex items-center">
          <Button
            type="text"
            icon={<svg width="21" height="15" viewBox="0 0 21 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M0.777557 1.19531C0.777557 0.781099 1.11334 0.445312 1.52756 0.445312H19.5276C19.9418 0.445312 20.2776 0.781099 20.2776 1.19531C20.2776 1.60953 19.9418 1.94531 19.5276 1.94531H1.52756C1.11334 1.94531 0.777557 1.60953 0.777557 1.19531Z" fill="white"></path><path fillRule="evenodd" clip-rule="evenodd" d="M0.777557 7.69531C0.777557 7.2811 1.11334 6.94531 1.52756 6.94531H15.5276C15.9418 6.94531 16.2776 7.2811 16.2776 7.69531C16.2776 8.10953 15.9418 8.44531 15.5276 8.44531H1.52756C1.11334 8.44531 0.777557 8.10953 0.777557 7.69531Z" fill="white"></path><path fillRule="evenodd" clip-rule="evenodd" d="M0.777557 14.1953C0.777557 13.7811 1.11334 13.4453 1.52756 13.4453H19.5276C19.9418 13.4453 20.2776 13.7811 20.2776 14.1953C20.2776 14.6095 19.9418 14.9453 19.5276 14.9453H1.52756C1.11334 14.9453 0.777557 14.6095 0.777557 14.1953Z" fill="white"></path></svg>}
            onClick={() => setMobileMenuOpen(true)}
            className="text-white! rounded-xl! w-[44px]! h-[44px]! flex! items-center! justify-center!"
          />
        </div>

        {/* LOGO */}
        <div className="flex-shrink-0 flex-1 lg:flex-none flex justify-center lg:justify-start">
          <Link to="/">
            <Typography.Title
              level={3}
              className="font-sf! font-black! text-2xl! sm:text-xl! md:text-2xl! xl:text-3xl! cursor-pointer! text-white! m-0!"
            >
              TechShop
            </Typography.Title>
          </Link>
        </div>

        {/* SEARCH & BRANCH (DESKTOP) */}
        <div className="hidden lg:flex items-center sm:gap-15 w-[50%]!">
          <div className="hidden lg:flex cursor-pointer min-w-fit mr-30 -ml-50">
            <Dropdown
              menu={{ items, className: 'custom-dropdown-menu' }}
              trigger={['hover']}
              className="text-white flex justify-center bg-[#090D1466]! items-center h-[44px] rounded-full w-full! px-10!"
            >
              <Text className="text-white! text-base! flex! items-center!">
                <BsGeoAltFill className="mr-5! text-lg!" />
                <Text className="text-white! text-[16px]! flex! items-center!">
                  Chi nhánh
                </Text>
              </Text>
            </Dropdown>
          </div>
          <div className="hidden lg:flex items-center flex-1 w-3/4">
            <SearchBox />
          </div>
        </div>

        <div className="flex items-center gap-4 sm:gap-15">
          {localStorage.getItem('access_token') ? (
            <div className="hidden! lg:block!">
              <UserInformation />
            </div>
          ) : (
            <Flex gap={4} className="hidden! lg:flex! p-10! cursor-pointer! rounded-full! border-0! bg-[#7d161c]!">
              <Dropdown
                menu={{
                  items: [
                    {
                      key: 'login',
                      label: 'Đăng nhập',
                      onClick: () => setShowLogin(true),
                    },
                    {
                      key: 'signup',
                      label: 'Đăng ký',
                      onClick: () => setShowSignup(true),
                    },
                  ],
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M17.7545 13.9999C18.9966 13.9999 20.0034 15.0068 20.0034 16.2488V17.1673C20.0034 17.7406 19.8242 18.2997 19.4908 18.7662C17.9449 20.9294 15.4206 22.0011 12.0004 22.0011C8.5794 22.0011 6.05643 20.9289 4.51427 18.7646C4.18231 18.2987 4.00391 17.7409 4.00391 17.1688V16.2488C4.00391 15.0068 5.01076 13.9999 6.25278 13.9999H17.7545ZM12.0004 2.00464C14.7618 2.00464 17.0004 4.24321 17.0004 7.00464C17.0004 9.76606 14.7618 12.0046 12.0004 12.0046C9.23894 12.0046 7.00036 9.76606 7.00036 7.00464C7.00036 4.24321 9.23894 2.00464 12.0004 2.00464Z" fill="inherit"></path></svg>
              </Dropdown>
            </Flex>
          )}
          <Button
            onClick={() => {
              if (!user) {
                setShowLogin(true);
                message.warning('Vui lòng đăng nhập để mở giỏ hàng');
              } else {
                navigate('/cart');
              }
            }}
            type="primary"
            size="large"
            icon={<BsFillBagFill />}
            className="text-white! bg-[#7d161c]! rounded-full! lg:bg-black! hover:bg-primary/80 sm:w-full! w-[44px]! h-[44px]! border-none"
          >
            <span className="hidden lg:inline ml-2 ">Giỏ hàng</span>
          </Button>
        </div>
      </div>

      <div className="lg:hidden w-full px-2 mt-8">
        <SearchBox />
      </div>

      {/* MOBILE DRAWER */}
      <Drawer
        title={<Typography.Title level={3} className="font-bold! m-0! text-lg! text-white!">Techshop</Typography.Title>}
        placement="left"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        closable={false}
        extra={
          <div
            className="text-white text-xl cursor-pointer font-bold"
            onClick={() => setMobileMenuOpen(false)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="Dismiss"><path id="Shape" d="M4.2097 4.3871L4.29289 4.29289C4.65338 3.93241 5.22061 3.90468 5.6129 4.2097L5.70711 4.29289L12 10.585L18.2929 4.29289C18.6834 3.90237 19.3166 3.90237 19.7071 4.29289C20.0976 4.68342 20.0976 5.31658 19.7071 5.70711L13.415 12L19.7071 18.2929C20.0676 18.6534 20.0953 19.2206 19.7903 19.6129L19.7071 19.7071C19.3466 20.0676 18.7794 20.0953 18.3871 19.7903L18.2929 19.7071L12 13.415L5.70711 19.7071C5.31658 20.0976 4.68342 20.0976 4.29289 19.7071C3.90237 19.3166 3.90237 18.6834 4.29289 18.2929L10.585 12L4.29289 5.70711C3.93241 5.34662 3.90468 4.77939 4.2097 4.3871L4.29289 4.29289L4.2097 4.3871Z" fill="white"></path></g></svg>
          </div>
        }
        className="font-inter!"
        classNames={{
          header: 'bg-gradient-primary-to-secondary! px-12! py-10!',
          body: 'bg-gray-100! p-0!',
        }}
        width={320}
      >
        <div className="flex flex-col gap-3">
          {user ? (
            <div className="bg-gray-50 p-12 rounded-md border border-gray-100 flex flex-col gap-1">
              <Text className="font-bold text-lg text-gray-800">{user.name}</Text>
              <Text className="text-gray-500 text-sm">{user.email}</Text>
            </div>
          ) : (
            <div className="flex items-center gap-16 p-12">
              <Flex vertical gap={10}>
                <Typography.Text className='text-[14px]! font-bold!'>
                  Đăng nhập ngay để nhận nhiều ưu đãi hấp dẫn
                </Typography.Text>
                <Button
                  type="primary"
                  size="large"
                  className="bg-gradient-primary-to-secondary! w-fit! px-16! hover:bg-[#a1161b] lg:text-base! rounded-lg! text-[14px]! font-medium! h-40!"
                  onClick={() => { setMobileMenuOpen(false); setShowLogin(true); }}
                >
                  Đăng nhập
                </Button>
              </Flex>
              <div className='flex-1'>
                <Image src='/authentication.svg' preview={false} width={110} height={110} />
              </div>
            </div>
          )}
        </div>

        <Collapse className='mx-10!' items={drawerBranchItems}></Collapse>

      </Drawer>
    </Layout.Header>
  );
}

function UsersLayout() {
  const { showLogin, showSignup, loading, showForgotPassword } =
    useAppContext();

  return (
    <Layout className="font-inter! relative! flex! flex-col! items-center!">
      <Header />

      {loading ? (
        <Spin size="large" fullscreen />
      ) : (
        <Layout.Content className="w-5/6! max-lg:w-[90%]! bg-[#f3f4f6]! min-h-screen!  mt-[120px]!  lg:mt-[60px]!  flex flex-col items-center rounded-[10px]">
          <Outlet />
          {showLogin && <Login />}
          {showSignup && <Signup />}
          {showForgotPassword && <ForgotPasswordModal />}
          <ChatBot />
        </Layout.Content>
      )}

      <FooterComponent />
      <style>{`
        .overflow-y-auto::-webkit-scrollbar {
          width: 4px;
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 2px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
      `}</style>
    </Layout>
  );
}

export default UsersLayout;
