export const navigation = {
  appName: 'Umobi',
  pages: {
    public: {
      home: {
        route: '/',
        name: 'Início',
      },
      about: {
        route: '/about',
        name: 'Sobre nós',
      },
      signUp: {
        route: '/sign-up',
        name: 'Inscreva-se'
      },
      signIn: {
        route: '/sign-in',
        name: 'Login'
      },
      signOut: {
        route: '/sign-out',
        name: 'Sair'
      }
    },
    private:
    {
      dashboard: {
        route: '/dashboard',
        name: 'Dashboard',
      },
      registration: {
        route: '/registration',
        name: 'Inscrição',
      },
      profile: {
        route: '/profile',
        name: 'Perfil',
      },
    }
  }
};

export const colors = {
  primary_light: '#2DB4E3',
  primary_dark: '#4646E9',
  black_light: '#252C3D',
  black_dark: '#13181F',
  text: '#D7DFEB',
  text_dark: '#A2AAB6',
  placeholder: '#8994BD'
}

export const resources = {
  video: 'https://www.youtube.com/watch?v=cVlPuKw2k1U',
  instagram: 'https://www.instagram.com/umobi__/',
  facebook: 'https://www.facebook.com/groups/276866552474105'
}