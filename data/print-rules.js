const getPagesRanges = (info) => {
  if (!info.subject.toLocaleLowerCase().includes("faktura")) return {
    pagesRanges: null,
    reason: "SUBJECT NOT: faktura"
  };
  if (info.to.toLocaleLowerCase().includes("infolet.pl")) return {
    pagesRanges: null,
    reason: "TO: infolet.pl"
  };
  return {
    pagesRanges: "1",
    reason: null
  };
};

module.exports = {
  getPagesRanges
}
