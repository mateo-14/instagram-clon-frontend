import FeedPost from "components/Post/FeedPost";
import Layout from 'components/Layout';

export default function Home() {
  return (
    <Layout>
      <section>
        <FeedPost/>
      </section>
    </Layout>
  );
}
