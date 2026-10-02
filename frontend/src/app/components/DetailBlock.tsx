export function DetailBlock({
  title,
  content,
}: {
  title: string;
  content: string;
}) {
  return (
    <section className="detail-block">
      <h2>{title}</h2>
      <p>{content}</p>
    </section>
  );
}
