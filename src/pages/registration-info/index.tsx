import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";

import { useApp } from "@/context/AppContext";

import { Layout } from "@/components/common/Layout"
import { Loader } from "@/components/common/Loader";
import { Title } from "@/components/common/Title"

// import styles from '@/styles/pages/registration-info.module.scss';
import { useAuth } from "@/context/AuthContainer";
import { Info, InfoGroup } from "@/components/common/Info";
import moment from "moment";
import { getUserInfo } from "@/services/umobi/umobi.api";
import { UserInfo } from "@/services/umobi/models/UserInfo";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";

export default function Login() {
  const INITIAL_STATE = {
    address: '',
    birthDate: moment().format('DD/MM/yyyy'),
    email: '',
    name: '',
    parentNames: '',
    phoneNumber: ''
  } as UserInfo;

  const auth = useAuth();
  const app = useApp();

  useEffect(() => {
    getUserInfo().then(res => {
      const userData = {
        ...res,
        birthDate: moment(res.birthDate).format('DD/MM/yyyy')
      } as UserInfo;
      setUserInfo(userData);
    }).catch(err => console.log(err));
  }, []);

  const [userInfo, setUserInfo] = useState<UserInfo>(INITIAL_STATE);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    app.setIsLoading(true);
  }

  return (
    <>
      {auth.loading || app.isLoading ? <Loader loading={app.isLoading} /> :
        (
          <Layout>
            <Title
              title={`Bem-vindo, ${auth?.user?.name?.split(' ')[0]}`}
              subtitle="Aqui você irá acompanhar o status da sua inscrição." />

            <InfoGroup>
              <Info label={'E-mail'} text={userInfo?.email} />
              <Info label={'Telefone'} text={userInfo.phoneNumber} />
              <Info label={'Data de Nascimento'} text={userInfo.birthDate} />
            </InfoGroup>
            <InfoGroup>
              <Info label={'Nome dos pais'} text={userInfo.parentNames} />
              <Info label={'Endereço'} text={userInfo.address} />
            </InfoGroup>

            <form action="">

            </form>
          </Layout>
        )
      }
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { 'umobi.token': token } = parseCookies(ctx);

  if (!token) {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    }
  }

  return {
    props: {}
  }
}