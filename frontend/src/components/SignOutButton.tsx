type SignOutButtonProps = {
  logoutHandler: () => void;
};

const SignOutButton: React.FC<SignOutButtonProps> = ({ logoutHandler }) => {
  return (
    <button
      className="fixed bottom-10 left-10 bg-red-500 border border-black px-4 py-2"
      onClick={logoutHandler}
    >
      SIGN OUT
    </button>
  );
};

export default SignOutButton;
