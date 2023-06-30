import { Layout } from "@/components/common/Layout"
import { Loader } from "@/components/common/Loader";
import { Title } from "@/components/common/Title"
import { useApp } from "@/context/AppContext";

export default function About() {
  const app = useApp();


  return (
    <Layout>
      <Loader loading={app.isLoading} />
      <Title title="Sobre nós" />
    </Layout>
  )
}