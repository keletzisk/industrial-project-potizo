import { Container, Heading, Link, Stack, Text } from "@chakra-ui/react";
import React from "react";

export function Developers() {
  return (
    <Container maxW="xl" ml={0} mt={2}>
      <Stack gap={4}>
        <Text>
          Η εφαρμογή «ΠοτίΖΩ» αναπτύχθηκε για το Δήμο Θεσσαλονίκης από ομάδες
          φοιτητών του τμήματος Πληροφορικής του CITY College, University of
          York Europe Campus στη Θεσσαλονίκη.
        </Text>
        <Text>
          Αποτελεί μέρος του Industrial Project των φοιτητών, ενός μαθήματος που
          εντάσσεται στο πρόγραμμα σπουδών του Τμήματος της Πληροφορικής του
          CITY College. Οι φοιτητές εργάζονται ομαδικά σε αληθινές συνθήκες
          εργασίας, αναπτύσουν νέες δεξιότητες και συμμετέχουν στην ανάπτυξη
          ψηφιακών εργαλείων που βοηθούν την κοινωνία.
        </Text>
        <Text>
          Τα άτομα που εργάστηκαν για την εφαρμογή «ΠοτίΖΩ» (και έδωσαν την
          έγκρισή τους για την εμφάνιση τους στη λίστα) είναι οι:
        </Text>
        <Stack>
          <Heading size="sm">Ομάδα φοιτητών 1</Heading>
          <Text as="span"></Text>
          <Link
            color="blue"
            isExternal
            href="https://www.linkedin.com/in/antonisantoniadis-709a88208"
          >
            Antonios Antoniadis
          </Link>

          <Link
            color="blue"
            isExternal
            href="https://www.linkedin.com/in/vijon-baraku-3aa660232"
          >
            Vijon Baraku
          </Link>

          <Text as="span">Evangelos Barmpas</Text>

          <Link
            color="blue"
            isExternal
            href="https://www.linkedin.com/in/lorikkorca"
          >
            Lorik Korca
          </Link>

          <Text as="span">Rei Manushi </Text>
        </Stack>
        <Stack>
          <Heading size="sm">Ομάδα φοιτητών 2</Heading>

          <Link
            color="blue"
            isExternal
            href="https://www.linkedin.com/in/aggelogiannos/"
          >
            Ioannis Angelos Chaidemenos
          </Link>

          <Link
            color="blue"
            isExternal
            href="https://www.linkedin.com/in/phillipos-andrianos-k/"
          >
            Philippos Andrianos Kalatzis
          </Link>

          <Link
            color="blue"
            isExternal
            href="https://www.linkedin.com/in/nikos-lintas-computer-scientist/"
          >
            Nikolaos Lintas
          </Link>

          {/* <Link
            color="blue"
            isExternal
            href="https://www.linkedin.com/in/giorgos-tamvakas-524253213/"
          >
            Georgios Tamvakas
          </Link> */}
        </Stack>
        <Stack>
          <Heading size="sm">Ομάδα φοιτητών 3</Heading>

          <Link
            color="blue"
            isExternal
            href="http://www.linkedin.com/in/tron-baraku"
          >
            Tron Baraku
          </Link>

          {/* <Text as="span">Yusuf Demirhan</Text> */}

          <Link
            color="blue"
            isExternal
            href="https://www.linkedin.com/in/marino-osmanllari-42a79b281/"
          >
            Marino Osmanllari
          </Link>

          <Link
            color="blue"
            isExternal
            href="https://www.linkedin.com/in/chasebtaylor/"
          >
            Chase Burton Taylor
          </Link>
        </Stack>
        <Stack>
          <Heading size="sm">Ομάδα φοιτητών 4</Heading>
          <Link color="blue" href="https://www.linkedin.com/in/nitahoxha1/">
            Nita Hoxha
          </Link>

          <Link
            color="blue"
            isExternal
            href="https://gr.linkedin.com/in/eleni-kokonesi-3808a7154"
          >
            Eleni Kokonesi
          </Link>

          <Link
            color="blue"
            href="https://gr.linkedin.com/in/elias-moutzouris-03a6862a"
          >
            Ilias Moutzouris
          </Link>

          <Link
            color="blue"
            isExternal
            href="https://www.linkedin.com/in/grigoris-papapostolou-b156bb156"
          >
            Grigorios Papapostolou
          </Link>

          <Link
            color="blue"
            isExternal
            href="https://www.linkedin.com/in/aleksandra-pavlovic-8264ba195"
          >
            Aleksandra Pavlovic
          </Link>
          <Link
            color="blue"
            isExternal
            href="https://gr.linkedin.com/in/alpournaras"
          >
            Alexandros Pournaras
          </Link>

          <Link
            color="blue"
            isExternal
            href="http://linkedin.com/in/vjosashalasahiti"
          >
            Vjosa Shala Sahiti
          </Link>
        </Stack>

        <Stack>
          <Heading size="sm">Άλλοι συντελεστές</Heading>

          <Link
            color="blue"
            href="https://www.linkedin.com/in/andreas-dranidis-086ab084/"
          >
            Andreas Dranidis
          </Link>

          <Link
            color="blue"
            isExternal
            href="https://gr.linkedin.com/in/dranidis"
          >
            Dimitris Dranidis
          </Link>

          <Link
            color="blue"
            isExternal
            href="https://gr.linkedin.com/in/ioanna-kapnopoulou"
          >
            Ioanna Kapnopoulou
          </Link>

          <Text as="span">Ioannis Tzintziras</Text>
        </Stack>

        <Link isExternal href="https://invent.york.citycollege.eu/">
          <Heading color="blue" size="md">
            Created as a project of Invent, City College
          </Heading>
        </Link>
      </Stack>
    </Container>
  );
}
