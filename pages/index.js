/* eslint-disable react/jsx-key */
import CustomerLayout from "../components/layout/CustomerLayout";
import { getCategories, getTrending } from "../lib/back/CategoryService";
import Trending from "../components/category/Trending";
import { getOffers } from "../lib/back/OfferService";
import DiscoverLatest from "../components/offer/DiscoverLatest";
import NewsLetter from "../components/newsletter/NewsLetter";
import OffersSection from "../components/offer/OffersSection";
import CategoriesSection from "../components/category/CategoriesSection";
import SectionSearch from "../components/search/SectionSearch";
import { getSession } from "next-auth/react";
import {
  isAdminSession,
  isModeratorSession,
  isOwner,
} from "../lib/back/UserService";
import {
  URL_BACKOFFICE_PAGE,
  URL_OWNER_PAGE,
} from "../lib/front/web/constants";
import { getSocialMedias } from "../lib/back/SocialMediaService";
import SocialMedia from "../components/common/SocialMedia";

export default function Home(props) {
  return (
    <CustomerLayout>
      <SectionSearch></SectionSearch>
      <DiscoverLatest className="mb-5"></DiscoverLatest>
      <Trending
        className="mb-5"
        trendingCollections={props.trendingCollections}
      ></Trending>
      <CategoriesSection
        className="mb-5"
        categories={props.categories}
      ></CategoriesSection>
      <OffersSection className="mb-5" offers={props.offers}></OffersSection>
      <NewsLetter className="mb-5"></NewsLetter>
      <SocialMedia socialMedias={props.socialMedias}></SocialMedia>
    </CustomerLayout>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (isAdminSession(session) || isModeratorSession(session)) {
    return {
      redirect: {
        destination: URL_BACKOFFICE_PAGE,
        permanent: false,
      },
    };
  }

  if (isOwner(session)) {
    return {
      redirect: {
        destination: URL_OWNER_PAGE,
        permanent: false,
      },
    };
  }

  let trendingCollections = await getTrending();
  let categories = await getCategories();
  let offers = await getOffers();
  let socialMedias = await getSocialMedias();

  return {
    props: {
      trendingCollections,
      categories,
      offers: offers.offers,
      socialMedias,
    },
  };
}
