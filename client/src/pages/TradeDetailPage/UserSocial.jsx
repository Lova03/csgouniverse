const UserSocial = ({ title, link, Icon, color }) => {
  return (
    <a
      href={link}
      rel='noreferrer'
      target='_blank'
      className={`flex items-center justify-center space-x-1 px-2 py-1 mt-2 rounded-sm transition-all duration-300 cursor-pointer ${color}`}>
      <Icon size='1.25rem' className='h-5' />
      <span>{title}</span>
    </a>
  );
};

export default UserSocial;
