import {
  reactExtension,
  Banner,
  Text,
  useInstructions,
  useTranslate,
} from '@shopify/ui-extensions-react/checkout';

export default reactExtension(
  'purchase.checkout.block.render',
  () => <Extension />,
);

function Extension() {
  const translate = useTranslate();
  const instructions = useInstructions();

  // Check if we can update checkout attributes
  if (!instructions.attributes.canUpdateAttributes) {
    return (
      <Banner title="checkout-ui" status="warning">
        <Text>Unable to update attributes.</Text>
      </Banner>
    );
  }

  return (
    <Banner title="checkout-ui" status="success">
      <Text>
        {translate('checkout-ui')}
        <div>Hello</div>
      </Text>
    </Banner>
  );
}