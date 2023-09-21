export const isCardAgeInfoType = (
  card: Cards):
  card is CardAgeInfo => {
  return (card as CardAgeInfo).key !== undefined;
};

export const isCardCharacterDetailsInfoType = (
  card: Cards):
  card is CardCharacterDetailsInfo => {
  return (card as CardCharacterDetailsInfo).label !== undefined;
};
