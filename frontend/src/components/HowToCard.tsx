
export default function HowToCard({title,description}: {title: string, description: string}) {
  return (
    <div className="">
      <p className="text-[18px] font-medium">{title}</p>
      <p className="mt-2 text-[14px]">
        {description}
      </p>
    </div>
  );
}
