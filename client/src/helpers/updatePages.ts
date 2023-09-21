export const updateDublicate = (content: IStoryPage[]) => {
  const newContent = content
    .map((item: IStoryPage, index: number) => {
      if (index === 0) {
        return item;
      } else if (index === content.length - 1 &&
        item.image === content[index - 1].image) {
        return {
          ...item,
          dublicate: true,
        };
      } else if (item.image === content[index - 1].image) {
        return {
          ...item,
          dublicate: true,
        };
      } else {
        return item;
      }
    });

  return newContent;
};

export const updateContent = (content: IStoryPage[]) => {
  let newContent = content
    .map((item: IStoryPage, index: number) => {
      if (item.image === content[index + 1]?.image) {
        return {
          ...item,
          text: item.text + ' ' + content[index + 1].text,
        };
      } else if (item.image === content[index - 1]?.image) {
        return null;
      } else {
        return item;
      }
    });
  newContent = newContent.filter((item: IStoryPage | null) => item !== null);

  return newContent as IStoryPage[];
};
