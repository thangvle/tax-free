import {
  reactExtension,
  AdminAction,
  Text,
  Button,
  useExtensionApi,
} from '@shopify/ui-extensions-react/admin';
import { useEffect, useState } from 'react';

export default reactExtension(
  'admin.product-details.action.render',
  () => <TaxFreeSettings />,
);

interface Product {
  id: string;
  title: string;
  taxExempt?: boolean;
  taxExemptThreshold?: number;
}

function TaxFreeSettings() {
  const { i18n, close, data } = useExtensionApi();
  const [product, setProduct] = useState<Product | null>(null);
  const [taxExempt, setTaxExempt] = useState(false);
  const [threshold, setThreshold] = useState('0');
  const [exemptionType, setExemptionType] = useState('none');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data?.selected?.length > 0) {
      loadProductData();
    }
  }, [data?.selected]);

  const loadProductData = async () => {
    try {
      const query = {
        query: `
          query GetProduct($id: ID!) {
            product(id: $id) {
              id
              title
              taxable
              metafields(first: 10, namespace: "tax_free") {
                nodes {
                  key
                  value
                }
              }
            }
          }
        `,
        variables: { id: data.selected[0].id },
      };

      const response = await fetch("shopify:admin/api/graphql.json", {
        method: "POST",
        body: JSON.stringify(query),
      });

      if (response.ok) {
        const result = await response.json();
        const productData = result.data.product;

        // Check metafields for tax-free settings
        const taxExemptMeta = productData.metafields.nodes.find(
          (m: any) => m.key === 'exempt'
        );
        const thresholdMeta = productData.metafields.nodes.find(
          (m: any) => m.key === 'threshold'
        );

        setProduct({
          id: productData.id,
          title: productData.title,
          taxExempt: taxExemptMeta?.value === 'true',
          taxExemptThreshold: parseFloat(thresholdMeta?.value || '0'),
        });

        setTaxExempt(taxExemptMeta?.value === 'true');
        setThreshold(thresholdMeta?.value || '0');
        setExemptionType(taxExemptMeta?.value === 'true' ? 'always' : 'none');
      }
    } catch (error) {
      console.error('Error loading product data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const mutation = {
        query: `
          mutation UpdateProductMetafields($input: ProductInput!) {
            productUpdate(input: $input) {
              product {
                id
              }
              userErrors {
                field
                message
              }
            }
          }
        `,
        variables: {
          input: {
            id: product?.id,
            metafields: [
              {
                namespace: 'tax_free',
                key: 'exempt',
                value: taxExempt.toString(),
                type: 'boolean',
              },
              {
                namespace: 'tax_free',
                key: 'threshold',
                value: threshold,
                type: 'number_decimal',
              },
              {
                namespace: 'tax_free',
                key: 'exemption_type',
                value: exemptionType,
                type: 'single_line_text_field',
              },
            ],
          },
        },
      };

      const response = await fetch("shopify:admin/api/graphql.json", {
        method: "POST",
        body: JSON.stringify(mutation),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.data.productUpdate.userErrors.length === 0) {
          console.log('Tax-free settings saved successfully');
          close();
        } else {
          console.error('Errors:', result.data.productUpdate.userErrors);
        }
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminAction
        title="Tax-Free Settings"
        primaryAction={{
          content: 'Loading...',
          disabled: true,
          onAction: () => {},
        }}
        secondaryActions={[
          {
            content: 'Close',
            onAction: close,
          },
        ]}
      >
        <Text>Loading product data...</Text>
      </AdminAction>
    );
  }

  return (
    <AdminAction
      title="Tax-Free Settings"
      primaryAction={{
        content: saving ? 'Saving...' : 'Save Settings',
        disabled: saving,
        onAction: saveSettings,
      }}
      secondaryActions={[
        {
          content: 'Cancel',
          onAction: close,
        },
      ]}
    >
      <Text>
        Configure Tax-Free Settings for: {product?.title}
      </Text>

      <Text>
        Tax Exemption Status: {taxExempt ? 'Enabled' : 'Disabled'}
      </Text>

      <Text>
        Threshold: ${threshold}
      </Text>

      <Text>
        These settings will be applied during checkout. Use the Shopify Admin to configure detailed tax-free rules.
      </Text>
    </AdminAction>
  );
}