/**
 * Simple sort util so we can take advantage of vanilla sort
 * with a defined field, sort direction, and provide a primer
 * function if required
 *
 * Sourced from https://stackoverflow.com/a/979325
 */
export function basicSort(field, reverse, primer) {
  const key = primer
    ? function(x) {
        return primer(x[field]);
      }
    : function(x) {
        return x[field];
      };

  reverse = !reverse ? 1 : -1;

  return function(a, b) {
    const aVal = key(a);
    const bVal = key(b);
    return reverse * ((aVal > bVal) - (bVal > aVal));
  };
}
