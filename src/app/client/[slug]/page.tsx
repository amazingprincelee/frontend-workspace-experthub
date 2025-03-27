

const getClients = (slug: string) => {

    const clients: Record<string, {name: string, age: number}> = {
        john: {name: "John Doe", age: 38},
        tony: {name: "tony stack", age: 48},
    }

    return clients[slug] || null ;

}


const clientDetails = async ({params}: {params: {slug: string}}) => {

    const clientData = getClients(params.slug)

    console.log(clientData);
    

    return(

       

        <>
            Client details from slug: {clientData.name}
        </>
    )
}


export default clientDetails