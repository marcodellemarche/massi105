import React from 'react';
import Link from 'next/link';
import { connect } from 'react-redux';
import { useTranslation, withTranslation } from 'react-i18next';

/**
 * Renders a list of categories and the number of products in each category. Used for product list
 * view sidebars.
 */
const CategoryList = ({ categories = [], current, className }) => {
  const { t } = useTranslation();

  return (
    <div className={className}>
      <h3 className="font-size-title font-weight-medium mb-3">
        {t('common.products')}
      </h3>
      <ul style={{ 'listStyleType': 'none' }} className="pl-0">
        { categories.map(category => (
          <li key={category.slug}>
            <Link href={`/collection#${category.slug}`}>
              <a
                style={{ 'fontWeight': current === category.id && 'bold' }}
                key={category.id} className="pb-2 cursor-pointer font-color-black"
              >
                { category.name }<sup>{ category.products }</sup>
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default connect(state => state)(CategoryList);
