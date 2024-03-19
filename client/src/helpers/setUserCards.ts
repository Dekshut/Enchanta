export const setUserCards = (userCard: Cards, allCards: Cards[]) => {
  const isCard = allCards.find((card: Cards) => card.type === userCard.type);
  if (isCard) {
    const updateSelectedKey = allCards.map((card: Cards) =>
      card.type === userCard.type ? userCard : card,
    );
    return updateSelectedKey;
  } else {
    return [...allCards, userCard];
  }
};

export const setUserCastomCards = (
  userCard: Cards,
  allCards: Cards[],
  userValue: string,
) => {
  const types = [
    'Custom name',
    'Custom details',
    'Random name',
    'Random details',
  ];
  const value = userValue.length ? userValue : 'a random choice';

  const isCard = allCards.find((card: Cards) => types.includes(card.type));
  if (isCard) {
    const updateSelectedKey = allCards.map((card: Cards) =>
      card.type === isCard.type ? { ...userCard, value } : card,
    );
    return updateSelectedKey;
  } else {
    return [...allCards, { ...userCard, value }];
  }
};
