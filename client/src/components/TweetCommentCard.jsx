

export default function TweetCommentCard({items}){

    function formatDate(date) {
        let d =new Date(date)
        let datePart = [
        d.getMonth() + 1,
        d.getDate(),
        d.getFullYear()
        ].map((n, i) => n.toString().padStart(i === 2 ? 4 : 2, "0")).join("/");
        let timePart = [
        d.getHours(),
        d.getMinutes(),
        ].map((n, i) => n.toString().padStart(2, "0")).join(":");
        return datePart + " " + timePart;
    }

    return(<div key={items._id} className="border-2 border-gray-400 rounded-xl py-5" ><div className="ms-3 flex gap-3 justify-between me-3">
        <div className="flex gap-3">
            <img src={`http://localhost:3000/user/profile/image/${items.userId.image}`} alt="" className="w-10 h-10 rounded-full" />
            <div className="flex flex-col gap-1">
                <a href={`/user/${items.userId._id}`}>{items.userId.name} {items.userId.surname}</a>
                <p className="text-xs">{formatDate(items.createAt)}</p>
            </div>
        </div>
        <p className="font-bold">{items.tag}</p>
    </div>

    <div className="ms-10 mt-3">
        <p>{items.text}</p>
    </div></div>)
}