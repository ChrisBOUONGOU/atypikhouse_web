import { Container } from "react-bootstrap";
import CustomerLayout from "../components/layout/CustomerLayout";
import { getAboutUsContent } from "../lib/back/AboutUsService";
import Head from "next/head";


export default function AbousUs(props) {

 
  return (
    <CustomerLayout>
      <Head>
        <title>A propos de nous - AtypikHouse</title>
        <meta
          property="og:title"
          content="A propos de nous - AtypikHouse"
          key="title"
        />
      </Head>
      <Container>
        <h1>A propos de nous</h1>
        <div> {props.aboutUsContent}</div>
      </Container>
    </CustomerLayout>
  );
}



export async function getStaticProps() {
  let aboutUsContent = await getAboutUsContent();

  return {
    props: {
      aboutUsContent,
    },
    revalidate: 3600,
  };
}
