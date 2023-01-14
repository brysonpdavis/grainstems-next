import styles from "./index.module.css";
import { type NextPage } from "next";
import Head from "next/head";

import AudioContainer from "../components/AudioContainer";
import { Grainstems } from "../components/Grainstems";


const Home: NextPage = () => {

  return (
    <>
      <Head>
        <title>G R A I N S T E M S</title>
        <meta name="description" content="a toy granular synth webapp" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <main className={styles.main}>
        <AudioContainer>
          {Grainstems}
        </AudioContainer>
      </main>
    </>
  );
};

export default Home;
