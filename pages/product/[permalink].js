import React, { useEffect, useState, useMemo } from 'react';
import commerce from '../../lib/commerce';
import { Collapse } from 'react-collapse';
import Head from 'next/head';
import ErrorPage from 'next/error'
import Image from 'next/image'
import { useRouter } from 'next/router';
import Root from '../../components/common/Root';
import TemplatePage from '../../components/common/TemplatePage';
import CarouselImages from '../../components/productAssets/CarouselImages';
import ProductDetail from '../../components/productAssets/ProductDetail';
// import ClientReview from '../../components/productAssets/ClientReview';
import SuggestedProducts from '../../components/productAssets/SuggestedProducts';
// import ExploreBanner from '../../components/productAssets/ExploreBanner';
import Footer from '../../components/common/Footer';
// import SocialMedia from '../../components/common/SocialMedia';
import CategoryList from '../../components/products/CategoryList';
import reduceProductImages from '../../lib/reduceProductImages';
import { useTranslation } from 'react-i18next';
import siteConfig from '../../utils/siteConfig.js';
import { shimmer, toBase64 } from '../../lib/shimmer.js';

export default function Product({ product }) {
  const {t} = useTranslation();
  const router = useRouter();
  const { permalink } = router.query;
  const [showSpecifics, setShowSpecifics] = useState(true);
  const [showShipping, setShowShipping] = useState(false);
  const [showAssistence, setShowAssistence] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  // const [product, setProduct] = useState(null);
  // const [loading, setLoading] = useState(true);
  
  const toggleSpecifics = () => {
    setShowSpecifics(!showSpecifics);
  }

  const toggleShipping = () => {
    setShowShipping(!showShipping);
  }

  const toggleAssistence = () => {
    setShowAssistence(!showAssistence);
  }

  const toggleReceipt = () => {
    setShowReceipt(!showReceipt);
  }

  const specificsField = useMemo(
    () => {
      let specifics = product?.attributes?.find(attribute => attribute.name?.toLowerCase() === 'specifics')?.value;
      
      if (!specifics) {
        return undefined;
      }

      // specifics = specifics.replace(/(?:\r\n|\r|\n)/g, '<br/>');

      const flexClass = 'd-flex justify-content-between';
      specifics = specifics.replace(/(?:\r\n|\r|\n)/g, `</span></p><br/><p class="${flexClass}"><label>`);
      specifics = specifics.replace(/:/g, ':</label/><span>');
      specifics = `<p class="${flexClass}"><label>` + specifics + '</span></p>';

      return specifics;
    }, 
    [product?.attributes]
  );

  // useEffect(() => {
  //   if (!permalink) {
  //     return;
  //   }

  //   const fetchProductByPermalink = async (permalink) => {
  //     try {
  //       const product = await commerce.products.retrieve(permalink, { type: 'permalink '});
  //       setProduct(product);
  //       setLoading(false);
  //     } catch (error) {
  //       setLoading(false);
  //     }
  //   };

  //   fetchProductByPermalink(permalink);
  // }, [permalink]);

  // if (loading) {
  //   return <TemplatePage page={ {message: t('common.loading')} } />
  // }

  if (product === null) {
    return <ErrorPage statusCode={404} />
  }

  const images = reduceProductImages(product);
  return (
    <Root>
      <Head>
        <title>{product.name} | {siteConfig.title}</title>
      </Head>

      <div className="py-5 my-5">
      <div className="main-product-content">
        {/* Sidebar */}
        <div className="product-sidebar">
          <CategoryList
            className="product-left-aside__category-list"
            current={ product.categories[0] && product.categories[0].id }
          />
          <CarouselImages images={images} />
        </div>

        <div className="product-images">
          {Array.isArray(images) ? (images.map((image, i) => (
            <Image
              key={i}
              src={image}
              alt='Product image'
              className="w-100 mb-3 carousel-main-images"
              placeholder="blur"
              blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(400, 400))}`}
              width={400}
              height={400}
              objectFit='contain'
            />
          ))) : (
            ''
          )}
        </div>

        {/* Right Section - Product Details */}
        <div className="product-detail">
          <ProductDetail product={product} />

          {specificsField && <>
            <div
              onClick={toggleSpecifics}
              className="d-flex cursor-pointer py-3 justify-content-between font-weight-medium"
            >
              {t('shop.specifics')}
              <svg className="fill-black w-24 h-24">
                <title>Show more</title>
                <use xlinkHref="/icons.svg#plus"></use>
              </svg>
            </div>
            <Collapse isOpened={showSpecifics}>
              <div
                className="pb-4 font-color-medium"
                dangerouslySetInnerHTML={{
                  __html: specificsField
                }}
                style={{lineHeight: 0.8}}
              />
            </Collapse>
            <div className="h-1 borderbottom border-color-black" />
          </>}

          <div
            onClick={toggleShipping}
            className="d-flex cursor-pointer py-3 justify-content-between font-weight-medium"
          >
            {t('shop.shipping')}
            <svg className="fill-black w-24 h-24">
              <title>Show more</title>
              <use xlinkHref="/icons.svg#plus"></use>
            </svg>
          </div>
          <Collapse isOpened={showShipping}>
            <div className="pb-4 font-color-medium">
              {t('shop.shippingDetails', { hours: siteConfig.shippingHours })}
            </div>
          </Collapse>
          <div className="h-1 border-bottom border-color-black" />

          <div
            onClick={toggleReceipt}
            className="d-flex cursor-pointer py-3 justify-content-between font-weight-medium"
          >
            {t('shop.receipt')}
            <svg className="fill-black w-24 h-24">
              <title>Show more</title>
              <use xlinkHref="/icons.svg#plus"></use>
            </svg>
          </div>
          <Collapse isOpened={showReceipt}>
            <div className="pb-4 font-color-medium" dangerouslySetInnerHTML={{
              __html: t('shop.receiptDetails')
            }}>
            </div>
          </Collapse>
          <div className="h-1 border-bottom border-color-black" />

          <div
            onClick={toggleAssistence}
            className="d-flex cursor-pointer py-3 justify-content-between font-weight-medium"
          >
            {t('shop.assistence')}
            <svg className="fill-black w-24 h-24">
              <title>Show more</title>
              <use xlinkHref="/icons.svg#plus"></use>
            </svg>
          </div>
          <Collapse isOpened={showAssistence}>
            <div className="pb-4 font-color-medium" dangerouslySetInnerHTML={{
              __html: t('shop.assistenceDetails')
            }}>
            </div>
          </Collapse>
          <div className="h-1 border-bottom border-color-black" />
        </div>
      </div>
    </div>

    {/* <ClientReview /> */}
    <SuggestedProducts />
    {/* <ExploreBanner /> */}
    {/* <SocialMedia /> */}
    <Footer />
  </Root>
  );
}

export async function getStaticPaths() {
  const response = await commerce.products.list();
  const products = await response.data;

  const paths = products.map((product) => ({
    params: { permalink: product.permalink },
  }))

  // { fallback: false } means other routes should 404.
  return { paths, fallback: false }
}

/** 
 * @param {{
 *  params: {
 *    permalink: string,
 *  },
 * }} props
 */
export async function getStaticProps({ params }) {
  const product = await commerce.products.retrieve(params.permalink, { type: 'permalink '});

  return { props: { product } }
}
