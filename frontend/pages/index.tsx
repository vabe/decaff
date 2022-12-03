import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import ItemCard from "@/components/item-card";

function HomeAboutCiffSection() {
  return (
    <section>
      <Typography variant="h4" sx={{ pb: 2 }}>
        About CIFF
      </Typography>
      <Typography variant="body1">
        The CrySyS Image File Format (CIFF) is a proprietary, uncompressed image
        format. The format contains a header and the uncompressed pixels of the
        image. Unfortunately, all libraries and modules implementing its parsing
        and display have been lost to time and faulty backups. All CIFF files
        start with a header. The header contains 7 major parts:
      </Typography>
      <Typography variant="body1" component="span">
        <ul>
          <li>
            <strong>Magic:</strong> 4 ASCII character spelling &#39;CIFF&#39;
          </li>
          <li>
            <strong>Header size:</strong> 8-byte-long integer, its value is the
            size of the header (all fields included), i.e. the first header_size
            number of bytes in the file make up the whole header.
          </li>
          <li>
            <strong>Content size:</strong> 8-byte long integer, its value is the
            size of the image pixels located at the end of the file. Its value
            must be width*heigth*3.
          </li>
          <li>
            <strong>Width:</strong> 8-byte-long integer giving the width of the
            image. Its value can be zero, however, no pixels must be present in
            the file in that case.
          </li>
          <li>
            <strong>Height:</strong> 8-byte-long integer giving the height of
            the image. Its value can be zero, however, no pixels must be present
            in the file in that case.
          </li>
          <li>
            <strong>Caption:</strong> Variable-length ASCII encoded string
            ending with \n. It is the caption of the image. As \n is a special
            character for the file format, the caption cannot contains this
            character.
          </li>
          <li>
            <strong>Tags:</strong> Variable number of variable-length ASCII
            encoded strings, each separated by \0 characters. The strings
            themselves must not be multiline. There must be a \0 character after
            the last tag as well.
          </li>
        </ul>
      </Typography>
      <Typography>
        The header is followed by the actual pixels of the image in RGB format,
        with each component taking up 1 byte. This part of the CIFF file must
        contain exactly content_size number of bytes.
      </Typography>
      <Link
        href="https://www.crysys.hu/downloads/vihima06/2020/CIFF.txt"
        rel="noopener"
      >
        CIFF schema definition
      </Link>
    </section>
  );
}

function HomeAboutCaffSection() {
  return (
    <section>
      <Typography variant="h4" sx={{ pt: 6, pb: 2 }}>
        About CAFF
      </Typography>
      <Typography variant="body1">
        The CrySyS Animation File Format is a proprietary file format for
        animating CIFF images. CAFF was intended to be a competitor to GIF.
        Unfortunately, the development team could not finish the parser in time,
        thus, GIF conquered the Internet. The format contains a number of blocks
        in the following format:
      </Typography>
      <Typography variant="body1" component="span">
        <ul>
          <li>
            <strong>ID:</strong> 1-byte number which identifies the type of the
            block:
            <ul>
              <li>0x1 - header</li>
              <li>0x2 - credits</li>
              <li>0x3 - animation</li>
            </ul>
          </li>

          <li>
            <strong>Length:</strong> 8-byte-long integer giving the length of
            the block.
          </li>
          <li>
            <strong>Data:</strong> This section is length bytes long and contain
            the data of the block.
          </li>
        </ul>
      </Typography>
      <Typography variant="body1">
        The first block of all CAFF files is the CAFF header. It contains the
        following parts:
      </Typography>
      <Typography variant="body1" component="span">
        <ul>
          <li>
            <strong>Magic:</strong> 4 ASCII character spelling &#39;CAFF&#39;
          </li>

          <li>
            <strong>Header size:</strong> 8-byte-long integer, its value is the
            size of the header (all fields included).
          </li>
          <li>
            <strong>Number of animated CIFFs:</strong> 8-byte long integer,
            gives the number of CIFF animation blocks in the CAFF file.
          </li>
        </ul>
      </Typography>
      <Typography variant="body1">
        The CAFF credits block specifies the creation date and time, as well as
        the creator of the CAFF file.
      </Typography>
      <Typography variant="body1" component="span">
        <ul>
          <li>
            <strong>Creation date and time:</strong> the year, month, day, hour
            and minute of the CAFF file&#39;s creation:
            <ul>
              <li>Y - year (2 bytes) </li>
              <li>M - month (1 byte) </li>
              <li>D - day (1 byte) </li>
              <li>h - hour (1 byte) </li>
              <li>m - minute (1 byte)</li>
            </ul>
          </li>

          <li>
            <strong>Length of creator:</strong> 8-byte-long integer, the length
            of the field specifying the creator.
          </li>
          <li>
            <strong>Creator:</strong> Variable-length ASCII string, the creator
            of the CAFF file.
          </li>
        </ul>
      </Typography>
      <Typography variant="body1">
        The CAFF animation block contains a CIFF image to be animated. The block
        has the following fields:
      </Typography>
      <Typography variant="body1" component="span">
        <ul>
          <li>
            <strong>Duration:</strong> 8-byte-long integer, miliseconds for
            which the CIFF image must be displayed during animation.
          </li>

          <li>
            <strong>CIFF:</strong> the image to be displayed in CIFF format.
          </li>
        </ul>
      </Typography>
      <Link
        href="https://www.crysys.hu/downloads/vihima06/2020/CAFF.txt"
        rel="noopener"
      >
        CAFF schema definition
      </Link>
    </section>
  );
}

export default function Home() {
  return (
    <Box>
      <Typography variant="h2" sx={{ py: 3 }}>
        Welcome
      </Typography>
      <HomeAboutCiffSection />
      <HomeAboutCaffSection />
    </Box>
  );
}
